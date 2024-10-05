import React, { useState, useCallback, useRef, useEffect } from "react";
import { getChatCompletion } from "@/utils/chatCompletion";
import axios from "axios";
import dynamic from "next/dynamic";

// Use dynamic imports to fetch components..this will optimize our perfomance and help load the page faster.
// we are however disabling ssr because we are using react-quill which uses document which is client side
const MessageList = dynamic(() => import("../MessageList/MessageList"), {
  ssr: false,
});
const MessageInput = dynamic(() => import("../MessageInput/MessageInput"), {
  ssr: false,
});
const ScrapingProgressModal = dynamic(
  () => import("../ScrappingModal.tsx/ScrappingModal"),
  {
    ssr: false,
  }
);

// given that this is a rather small applications, the interfaces are defined here needed but in complex cases we would use different files to manage these interfaces
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isScraping?: boolean;
  isGenerating?: boolean;
  scrapingUrls?: ScrapingURL[];
}

interface ScrapingURL {
  url: string;
  progress: number;
  status: "pending" | "scraping" | "complete" | "error";
}

// being teh parent, this chat area will control most states and functions required globally in teh children and thus are shared using props since they are not deeply nested.

const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const isGeneratingRef = useRef(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [scrapingUrls, setScrapingUrls] = useState<ScrapingURL[]>([]);
  const [showScrapingModal, setShowScrapingModal] = useState(false);

  const updateScrapingUrl = useCallback(
    // update the urls being scraped
    (url: string, updates: Partial<ScrapingURL>) => {
      setScrapingUrls((prevUrls) =>
        prevUrls.map((item) =>
          item.url === url ? { ...item, ...updates } : item
        )
      );
    },
    []
  );

  // this function handles scraping of the website  including calling teh scraping endpoint and handles results and updating data
  const scrapeWebsite = useCallback(
    async (messageId: string, url: string) => {
      let currentProgress = 0;

      try {
        // console.log(`Starting scraping for: ${url}`);

        setScrapingUrls((prev) => [
          ...prev,
          { url, progress: 0, status: "scraping" },
        ]);
        setShowScrapingModal(true);

        const intervalId = setInterval(() => {
          if (currentProgress < 100) {
            currentProgress += 20;
            updateScrapingUrl(url, { progress: currentProgress });
          } else {
            clearInterval(intervalId);
            updateScrapingUrl(url, { status: "complete" });
          }
        }, 1000); //checking the progress of date ScrapING process to update the UI accordingly

        const response = await axios.post("/api/scrape", { url });
        // console.log(`Response for ${url}:`, response.data.content);

        clearInterval(intervalId);
        updateScrapingUrl(url, { progress: 100, status: "complete" });

        return response.data.content;
      } catch (error) {
        // console.error(`Error scraping ${url}:`, error);
        updateScrapingUrl(url, { status: "error" });
        return null;
      }
    },
    [updateScrapingUrl]
  );

  useEffect(() => {
    // This useeffect helps track the progress of tehs craping and updating the data on that prigrammatically
    const allComplete = scrapingUrls.every(
      (url) => url.status === "complete" || url.status === "error"
    );
    if (allComplete && scrapingUrls.length > 0) {
      setTimeout(() => {
        setScrapingUrls([]);
        setShowScrapingModal(false);
      }, 2000);
    }
  }, [scrapingUrls]);

  const parseCustomCommands = async (
    messageId: string,
    content: string
  ): Promise<string> => {
    const urlRegex =
      /\[include-url: (.*?) max_execution_time:(\d+) filter:(true|false) store:(true|false)\]/g;

    // Explicitly convert the result of matchAll to an array to avoid typescript warnings. This idea was aid by Claude
    const matches = Array.from(content.matchAll(urlRegex));

    let parsedContent = content;
    for (const match of matches) {
      const [fullMatch, url] = match;
      const scrapedContent = await scrapeWebsite(messageId, url);

      // check if scrapping happend and replace url with scrapped content. Initially, this check was not there and some urls were "ESCAPING" being scrapped causing errors in the LLM. With GPT-4 i was able to debug and identify teh source of the leak
      if (scrapedContent) {
        parsedContent = parsedContent.replace(fullMatch, scrapedContent);
      } else {
        parsedContent = parsedContent.replace(
          fullMatch,
          "[Error scraping website]"
        );
      }
    }

    return parsedContent;
  };

  const handleSendMessage = useCallback(
    async (content: string, messageId?: string) => {
      if (isGeneratingRef.current) {
        // console.warn("Already generating a response, skipping new request.");
        return;
      }

      isGeneratingRef.current = true;
      const controller = new AbortController();
      abortControllerRef.current = controller;

      let userMessageId: string;
      let assistantMessageId: string;

      if (messageId) {
        // Editing an existing message. by using teh ID, we can change the respons eteh user gets without having to create a new message on the list. This enhances user experience and to do this later in a better way, we can have persistence so that we can show users a list of responses they gt for a certain thread as in ChatGPT
        userMessageId = messageId;
        assistantMessageId =
          messages.find(
            (msg) =>
              msg.role === "assistant" &&
              messages.indexOf(msg) >
                messages.findIndex((m) => m.id === messageId)
          )?.id || (Date.now() + 1).toString();

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: "", isGenerating: true }
              : msg.id === messageId
              ? { ...msg, content }
              : msg
          )
        );
      } else {
        // New message
        userMessageId = Date.now().toString();
        assistantMessageId = (Date.now() + 1).toString();

        setMessages((prev) => [
          ...prev,
          { id: userMessageId, role: "user", content },
          {
            id: assistantMessageId,
            role: "assistant",
            content: "",
            isGenerating: true,
          },
        ]);
      }

      // ?checking if there is the url command in the message that the user input using regex thus handling scraping if need be
      const urlCommand = content.match(/\[include-url:/);
      let parsedContent = content;

      if (urlCommand) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessageId ? { ...msg, isScraping: true } : msg
          )
        );

        // if their is url command send to the parseCommand function to handle scraping
        parsedContent = await parseCustomCommands(userMessageId, content);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessageId
              ? { ...msg, content: parsedContent, isScraping: false }
              : msg
          )
        );
      }

      try {
        const assistantResponse = await getChatCompletion(
          [
            ...messages,
            { id: userMessageId, role: "user", content: parsedContent },
          ],
          controller.signal,
          (chunk) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              )
            );
          }
        );

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: assistantResponse, isGenerating: false }
              : msg
          )
        );
      } catch (error) {
        // log for teh different errors in terms of getting a response from the LLM
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error generating response:", error);
        }
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantMessageId)
        );
      } finally {
        // keep track of teh isgenerating ref for application and UI purposes
        isGeneratingRef.current = false;
      }
    },
    [messages]
  );

  // we are using teh abortcontroller so that the generation will be stopped at the getCompletion function. This idea comes from how GPT-4 handles stopping
  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      // console.log("Generation stopped by user.");
    }
  }, []);

  // handles when user clicks on the edit button
  const handleStartEditing = useCallback((id: string) => {
    setEditingMessageId(id);
  }, []);

  // handle when user saves the edit thus triggering the process of communicating with the LLM
  const handleEditMessage = useCallback(
    async (id: string, newContent: string) => {
      setEditingMessageId(null);
      await handleSendMessage(newContent, id);
    },
    [handleSendMessage]
  );

  // handle when user cancels the editing request thus closing the editing input
  const handleCancelEditing = useCallback(() => {
    setEditingMessageId(null);
  }, []);

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      {/* MessageList will occupy the remaining space */}
      <div className="flex-1 overflow-y-auto p-4 scroll-bar">
        {/* Make MessageList scrollable */}
        <MessageList
          messages={messages}
          editingMessageId={editingMessageId}
          onStartEditing={handleStartEditing}
          onEditMessage={handleEditMessage}
          onCancelEditing={handleCancelEditing}
        />
      </div>
      {/* MessageInput fixed at the bottom */}
      <div className="sticky bottom-0 p-4 ">
        {/* Keeps input at the bottom */}
        <MessageInput
          onSendMessage={handleSendMessage}
          onStopGeneration={handleStopGeneration}
          isGenerating={isGeneratingRef.current}
        />
      </div>
      {showScrapingModal && (
        <ScrapingProgressModal
          urls={scrapingUrls}
          onClose={() => setShowScrapingModal(false)}
        />
      )}
    </div>
  );
};

export default ChatArea;

// dummy messages for testing UI without needing to make API calls. This thread was generated by GPT-4
// const [messages, setMessages] = useState<Message[]>([
//   {
//     id: "1",
//     role: "user",
//     content: "Hello, how are you?",
//     isGenerating: false,
//     isScraping: false,
//   },
//   {
//     id: "2",
//     role: "assistant",
//     content: "I'm good, thank you! How can I help you today?",
//     isGenerating: false,
//     isScraping: false,
//   },
//   {
//     id: "3",
//     role: "user",
//     content: "Can you tell me about the weather?",
//     isGenerating: false,
//     isScraping: false,
//   },
//   {
//     id: "4",
//     role: "assistant",
//     content: "Sure! The weather today is sunny with a high of 25°C.",
//     isGenerating: false,
//     isScraping: false,
//   },
//   {
//     id: "5",
//     role: "assistant",
//     content:
//       "Hello! I'm here to help you. Here's an example of a Python function that returns a list of items:\n\n```python\n def get_items():\n    return ['item1', 'item2', 'item3']\n```",
//     isGenerating: false,
//     isScraping: false,
//   },
//   {
//     id: "6",
//     role: "user",
//     content:
//       "Thanks for the code! Here's a long message from me with some markdown text:\n\n**Bold text**, _italic text_, and a list:\n\n- First item\n- Second item\n- Third item\n\nCould you also explain how I can use async/await for making API calls in JavaScript?",
//     isGenerating: false,
//     isScraping: false,
//   },
//   {
//     id: "7",
//     role: "assistant",
//     content:
//       "Certainly! Here's how you can use async/await for API calls in JavaScript:\n\n```javascript\n async function fetchData() {\n   try {\n     const response = await fetch('https://api.example.com/data');\n     const data = await response.json();\n     console.log(data);\n   } catch (error) {\n     console.error('Error fetching data:', error);\n   }\n }\n```",
//     isGenerating: false,
//     isScraping: false,
//   },
// ]);

// const [scrapingUrls, setScrapingUrls] = useState<ScrapingURL[]>([
//   {
//     url: "https://medium.com/@mircea.calugaru/react-quill-editor-with-full-toolbar-options-and-custom-buttons-undo-redo-176d79f8d375",
//     progress: 100,
//     status: "complete",
//   },
//   {
//     url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects",
//     progress: 50,
//     status: "scraping",
//   },
//   {
//     url: "https://www.smashingmagazine.com/2018/06/ux-product-design/",
//     progress: 75,
//     status: "scraping",
//   },
//   {
//     url: "https://www.example.com/nonexistent-page",
//     progress: 0,
//     status: "error",
//   },
//   {
//     url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
//     progress: 25,
//     status: "scraping",
//   },
//   {
//     url: "https://www.google.com/",
//     progress: 0,
//     status: "pending",
//   },
// ]);

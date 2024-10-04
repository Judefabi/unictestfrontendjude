import React, { useState, useCallback, useRef } from "react";
import MessageList from "../MessageList/MessageList";
import MessageInput from "../MessageInput/MessageInput";
import { getChatCompletion } from "@/utils/chatCompletion";
import axios from "axios";

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

const ChatArea: React.FC = () => {
  // const [messages, setMessages] = useState<Message[]>([]);
  // dummy messages for testing UI
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "Hello, how are you?",
      isGenerating: false,
      isScraping: false,
    },
    {
      id: "2",
      role: "assistant",
      content: "I'm good, thank you! How can I help you today?",
      isGenerating: false,
      isScraping: false,
    },
    {
      id: "3",
      role: "user",
      content: "Can you tell me about the weather?",
      isGenerating: false,
      isScraping: false,
    },
    {
      id: "4",
      role: "assistant",
      content: "Sure! The weather today is sunny with a high of 25°C.",
      isGenerating: false,
      isScraping: false,
    },
    {
      id: "5",
      role: "assistant",
      content:
        "Hello! I'm here to help you. Here's an example of a Python function that returns a list of items:\n\n```python\n def get_items():\n    return ['item1', 'item2', 'item3']\n```",
      isGenerating: false,
      isScraping: false,
    },
    {
      id: "6",
      role: "user",
      content:
        "Thanks for the code! Here's a long message from me with some markdown text:\n\n**Bold text**, _italic text_, and a list:\n\n- First item\n- Second item\n- Third item\n\nCould you also explain how I can use async/await for making API calls in JavaScript?",
      isGenerating: false,
      isScraping: false,
    },
    {
      id: "7",
      role: "assistant",
      content:
        "Certainly! Here's how you can use async/await for API calls in JavaScript:\n\n```javascript\n async function fetchData() {\n   try {\n     const response = await fetch('https://api.example.com/data');\n     const data = await response.json();\n     console.log(data);\n   } catch (error) {\n     console.error('Error fetching data:', error);\n   }\n }\n```",
      isGenerating: false,
      isScraping: false,
    },
  ]);

  const isGeneratingRef = useRef(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrapeWebsite = async (messageId: string, url: string) => {
    try {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                scrapingUrls: [
                  ...(msg.scrapingUrls || []),
                  { url, progress: 0, status: "scraping" },
                ],
              }
            : msg
        )
      );

      for (let progress = 25; progress <= 100; progress += 25) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  scrapingUrls: msg.scrapingUrls?.map((item) =>
                    item.url === url ? { ...item, progress } : item
                  ),
                }
              : msg
          )
        );
      }

      const response = await axios.post("/api/scrape", { url });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                scrapingUrls: msg.scrapingUrls?.map((item) =>
                  item.url === url ? { ...item, status: "complete" } : item
                ),
              }
            : msg
        )
      );

      return response.data.content;
    } catch (error) {
      console.error("Error scraping website:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                scrapingUrls: msg.scrapingUrls?.map((item) =>
                  item.url === url ? { ...item, status: "error" } : item
                ),
              }
            : msg
        )
      );
      return null;
    }
  };

  const parseCustomCommands = async (
    messageId: string,
    content: string
  ): Promise<string> => {
    const urlRegex =
      /\[include-url: (.*?) max_execution_time:(\d+) filter:(true|false) store:(true|false)\]/g;

    // Explicitly convert the result of matchAll to an array to avoid typescript warnings
    const matches = Array.from(content.matchAll(urlRegex));

    let parsedContent = content;
    for (const match of matches) {
      const [fullMatch, url] = match;
      const scrapedContent = await scrapeWebsite(messageId, url);

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
        console.warn("Already generating a response, skipping new request.");
        return;
      }

      isGeneratingRef.current = true;
      const controller = new AbortController();
      abortControllerRef.current = controller;

      let userMessageId: string;
      let assistantMessageId: string;

      if (messageId) {
        // Editing an existing message
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

      const urlCommand = content.match(/\[include-url:/);
      let parsedContent = content;

      if (urlCommand) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessageId ? { ...msg, isScraping: true } : msg
          )
        );

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
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error generating response:", error);
        }
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantMessageId)
        );
      } finally {
        isGeneratingRef.current = false;
      }
    },
    [messages]
  );

  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log("Generation stopped by user.");
    }
  }, []);

  const handleStartEditing = useCallback((id: string) => {
    setEditingMessageId(id);
  }, []);

  const handleEditMessage = useCallback(
    async (id: string, newContent: string) => {
      setEditingMessageId(null);
      await handleSendMessage(newContent, id);
    },
    [handleSendMessage]
  );

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
    </div>
  );
};

export default ChatArea;

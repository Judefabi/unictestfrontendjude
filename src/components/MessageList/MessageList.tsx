import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import QuickLinks from "../QuickLinks/QuickLinks";
import dynamic from "next/dynamic";

// changed to dynamic import to prevent failures due to react-quill using document which causes crashes as the app will try to render this on the server side. This also improves perfoamnce and initial load times
const MessageEditInput = dynamic(
  () => import("../MessageEditInput/MessageEditInput"),
  {
    ssr: false,
  }
);

// interfaces for the messages list component
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isScraping?: boolean;
  isGenerating?: boolean;
  isTrimmed?: boolean;
}

interface MessageListProps {
  messages: Message[];
  onStartEditing: (id: string) => void;
  editingMessageId: string | null;
  onEditMessage: (id: string, newContent: string) => void;
  onCancelEditing: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  onStartEditing,
  editingMessageId,
  onEditMessage,
  onCancelEditing,
}) => {
  // Ref for the bottom of the message list
  const bottomRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to the bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Trigger the effect whenever the messages change

  let firstAssistantMessageShown = false; // To track the first assistant message for UI enhancement purposes

  return (
    <div className="flex-1 overflow-y-auto p-4 w-[960px] mt-[200px]">
      {messages.map((message) => {
        const isFirstAssistantMessage =
          message.role === "assistant" && !firstAssistantMessageShown;

        if (isFirstAssistantMessage) {
          firstAssistantMessageShown = true;
        }

        return (
          <div
            key={message.id}
            className={`mb-10   ${
              message.role === "user" ? "text-right" : "text-left"
            }`}>
            {editingMessageId === message.id ? (
              <MessageEditInput
                initialContent={message.content}
                onSave={(newContent) => onEditMessage(message.id, newContent)}
                onCancel={onCancelEditing}
              />
            ) : (
              <div
                className={`inline-block p-2 rounded-lg max-w-[695px] space-y-3`}>
                {/* keeping this for user experience purposes to show scraping progress indication even if user closes scraping modal */}
                {message.isScraping ? (
                  <div>
                    <p className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 mt-2">
                      Scraping in progress...
                    </p>
                  </div>
                ) : message.isGenerating ? (
                  // show this as user awaits for the LLM response
                  <p className="text-sm text-gray-500">
                    Generating response...
                  </p>
                ) : (
                  <>
                    {message.role === "assistant" ? (
                      <>
                        {/* If this is the first assistant message, show the title */}
                        {isFirstAssistantMessage && (
                          <div className="text-label-large text-muted-foreground uppercase font-bold ">
                            World-Class React/Front-End Developer .{" "}
                            <span className="capitalize">Phi - Micsrosft</span>
                          </div>
                        )}

                        {/* Section 2: The response content. This will allow us to render markdown */}
                        <div className="text-body-large">
                          <ReactMarkdown
                            components={{
                              code: ({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }: any) => {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                return !inline && match ? (
                                  // syntax higlighter helps to show LLM responses that contain code
                                  <SyntaxHighlighter
                                    style={atomDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}>
                                    {String(children).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                              // when rendering markdowns, react markdown fails to properly handle things like lists, block quotes and table so i added this section to handle lists specifically but various additions can be done as the LLM response tyles grow
                              ol: ({ ordered, ...props }: any) => (
                                <ol className="list-decimal pl-4" {...props} />
                              ),
                              ul: (props) => (
                                <ul className="list-disc pl-4" {...props} />
                              ),
                              li: ({ children, ...props }: any) => (
                                <li className="mb-1" {...props}>
                                  {children}
                                </li>
                              ),
                              blockquote: ({ children, ...props }) => (
                                <blockquote
                                  className="border-l-4 pl-4 italic text-muted-foreground"
                                  {...props}>
                                  {children}
                                </blockquote>
                              ),
                            }}>
                            {message.content}
                          </ReactMarkdown>
                        </div>

                        {/* Section 3: Quick Links */}
                        {/* made this a reusbale component to allow easy management of teh functionalities */}
                        <QuickLinks />
                      </>
                    ) : (
                      <>
                        {/* User Message */}
                        <p className="text-body-large bg-card text-card-foreground rounded-xl p-4 text-left">
                          {message.content}
                        </p>
                        {/* Edit Butto. this button will replace the user input ubble with an editing containing istead of having to edit from teh main input container thus better user experience */}
                        <div className="flex gap-x-3 justify-end">
                          <button
                            onClick={() => onStartEditing(message.id)}
                            className="ml-2 text-xs text-gray-500 hover:text-gray-700">
                            Edit
                          </button>
                          <QuickLinks />
                        </div>
                      </>
                    )}

                    {/* with longer inut and reponses, the tokens limit is exceed and thus I introduced a trimming functionality as a temporary fix  */}
                    {message.isTrimmed && (
                      <p className="text-xs text-red-500 mt-1">
                        Note: This message was trimmed due to token limits.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Move management of scraping to chatarea so we can pop up the scarpping modal as sites scrape instead of the button like we are doing now */}
      {/* {selectedScrapingMessage?.scrapingUrls && (
        <ScrapingProgressModal
          urls={selectedScrapingMessage.scrapingUrls}
          onClose={() => setSelectedScrapingMessage(null)}
        />
      )} */}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;

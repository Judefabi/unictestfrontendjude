import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import MessageEditInput from "../MessageEditInput/MessageEditInput";
import ScrapingProgressModal from "../ScrappingModal.tsx/ScrappingModal";
import QuickLinks from "../QuickLinks/QuickLinks";

interface ScrapingURL {
  url: string;
  progress: number;
  status: "pending" | "scraping" | "complete" | "error";
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isScraping?: boolean;
  isGenerating?: boolean;
  isTrimmed?: boolean;
  scrapingUrls?: ScrapingURL[];
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
  const [selectedScrapingMessage, setSelectedScrapingMessage] =
    useState<Message | null>(null);

  // Ref for the bottom of the message list
  const bottomRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to the bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Trigger the effect whenever the messages change

  let firstAssistantMessageShown = false; // To track the first assistant message for UI rendering purposes

  return (
    <div className="flex-1 overflow-y-auto p-4 w-[960px]">
      {messages.map((message) => {
        const isFirstAssistantMessage =
          message.role === "assistant" && !firstAssistantMessageShown;

        if (isFirstAssistantMessage) {
          firstAssistantMessageShown = true;
        }

        return (
          <div
            key={message.id}
            className={`mb-10  ${
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
                {message.isScraping ? (
                  <div>
                    <p
                      className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 mt-2"
                      onClick={() => setSelectedScrapingMessage(message)}>
                      Scraping in progress... (click to view details)
                    </p>
                  </div>
                ) : !message.isScraping && message.isGenerating ? (
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

                        {/* Section 2: The response content */}
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
                        <QuickLinks />
                      </>
                    ) : (
                      <>
                        {/* User Message */}
                        <p className="text-body-large bg-card text-card-foreground rounded-xl p-7 text-left">
                          {message.content}
                        </p>
                        {/* Edit Button */}
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

      {selectedScrapingMessage?.scrapingUrls && (
        <ScrapingProgressModal
          urls={selectedScrapingMessage.scrapingUrls}
          onClose={() => setSelectedScrapingMessage(null)}
        />
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;

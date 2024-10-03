import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import MessageEditInput from "../MessageEditInput/MessageEditInput";
import ScrapingProgressModal from "../ScrappingModal.tsx/ScrappingModal";

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

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 ${
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
              className={`inline-block p-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}>
              {message.isScraping ? (
                <div>
                  <p
                    className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 mt-2"
                    onClick={() => setSelectedScrapingMessage(message)}>
                    Scraping in progress... (click to view details)
                  </p>
                </div>
              ) : message.isGenerating ? (
                <p className="text-sm text-gray-500">Generating response...</p>
              ) : (
                <>
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        // Syntax highlighting for code blocks
                        code: ({
                          node,
                          inline,
                          className,
                          children,
                          ...props
                        }: any) => {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
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
                        // add some code to help format items that wont be rendered in tyhe markdwon and syntax highligheter
                        // Ordered List (<ol>)
                        ol: ({ ordered, ...props }: any) => (
                          <ol className="list-decimal pl-4" {...props} />
                        ),
                        // Unordered List (<ul>)
                        ul: (props) => (
                          <ul className="list-disc pl-4" {...props} />
                        ),
                        // List items (<li>)
                        li: ({ children, ...props }) => (
                          <li className="mb-1" {...props}>
                            {children}
                          </li>
                        ),
                        // Blockquotes (<blockquote>)
                        blockquote: ({ children, ...props }) => (
                          <blockquote
                            className="border-l-4 border-gray-300 pl-4 italic text-gray-600"
                            {...props}>
                            {children}
                          </blockquote>
                        ),
                      }}>
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <>
                      <p>{message.content}</p>
                      <button
                        onClick={() => onStartEditing(message.id)}
                        className="ml-2 text-xs text-gray-500 hover:text-gray-700">
                        Edit
                      </button>
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
      ))}

      {selectedScrapingMessage?.scrapingUrls && (
        <ScrapingProgressModal
          urls={selectedScrapingMessage.scrapingUrls}
          onClose={() => setSelectedScrapingMessage(null)}
        />
      )}
    </div>
  );
};

export default MessageList;

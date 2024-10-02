import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 ${
            message.role === "user" ? "text-right" : "text-left"
          }`}>
          <div
            className={`inline-block p-2 rounded-lg ${
              message.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}>
            {message.role === "assistant" ? (
              <ReactMarkdown
                components={{
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
                        // style={theme} 
                        language={match[1]} // Language detected from className
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
                }}>
                {message.content}
              </ReactMarkdown>
            ) : (
              message.content
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;

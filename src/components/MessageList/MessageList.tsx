import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import MessageEditInput from "../MessageEditInput/MessageEditInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
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
                <>
                  {message.content}
                  <button
                    onClick={() => onStartEditing(message.id)}
                    className="ml-2 text-xs text-gray-500 hover:text-gray-700">
                    Edit
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
import React from "react";

interface Message {
  type: "user" | "bot";
  content: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${
            message.type === "user" ? "text-right" : "text-left"
          }`}>
          <span
            className={`inline-block p-2 rounded-lg ${
              message.type === "user"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800"
            }`}>
            {message.content}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;

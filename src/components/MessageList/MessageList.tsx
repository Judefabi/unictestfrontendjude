import React from "react";

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
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;

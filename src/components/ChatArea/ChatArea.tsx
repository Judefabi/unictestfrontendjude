import React from "react";
import MessageList from "../MessageList/MessageList";
import MessageInput from "../MessageInput/MessageInput";

interface Message {
  type: "user" | "bot";
  content: string;
}

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onSendMessage,
}) => {
  return (
    <div className="flex flex-col h-full  rounded-lg overflow-hidden">
      <MessageList messages={messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatArea;

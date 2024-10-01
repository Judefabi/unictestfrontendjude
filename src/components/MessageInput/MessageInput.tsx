"use client"
import React, { useState } from "react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className=" p-4">
      <div className="flex border border-gray-800 bg-background rounded-l-lg px-4 py-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-background"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className=" text-foreground px-4 py-2 rounded-r-lg ">
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;

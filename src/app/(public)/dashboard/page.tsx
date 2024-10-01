"use client"

import ChatInterface from "@/components/ChatArea/ChatArea";
import { useState } from "react";

interface Message {
  type: "user" | "bot";
  content: string;
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = { type: "user", content };
    setMessages([...messages, newMessage]);

    // TODO: Implement LLM API call here
    // For now, we'll just echo the message back
    setTimeout(() => {
      const botResponse: Message = {
        type: "bot",
        content: `You said: ${content}`,
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  return (
    <>
      <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
    </>
  );
}

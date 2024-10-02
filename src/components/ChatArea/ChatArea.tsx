import React, { useState, useCallback } from "react";
import { getChatCompletion } from "@/utils/chatCompletion";
import MessageList from "../MessageList/MessageList";
import MessageInput from "../MessageInput/MessageInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const handleSendMessage = useCallback(
    async (content: string) => {
      console.log("handleSendMessage called with content:", content); // Debug log
      const newUserMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
      };
      setMessages((prev) => {
        console.log("Updating messages state:", [...prev, newUserMessage]); // Debug log
        return [...prev, newUserMessage];
      });

      setIsGenerating(true);
      try {
        console.log("Calling getChatCompletion"); // Debug log
        const assistantResponse = await getChatCompletion([
          ...messages,
          newUserMessage,
        ]);
        console.log("Received assistant response:", assistantResponse); // Debug log
        const newAssistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: assistantResponse,
        };
        setMessages((prev) => [...prev, newAssistantMessage]);
      } catch (error) {
        console.error("Error generating response:", error);
      } finally {
        setIsGenerating(false);
      }
    },
    [messages]
  );

  const handleEditMessage = useCallback(
    async (id: string, newContent: string) => {
      const updatedMessages = messages.map((msg) =>
        msg.id === id ? { ...msg, content: newContent } : msg
      );
      setMessages(updatedMessages);
      setEditingMessageId(null);

      // Find the index of the edited message
      const editedIndex = updatedMessages.findIndex((msg) => msg.id === id);

      // Get all messages up to and including the edited message
      const messagesUpToEdited = updatedMessages.slice(0, editedIndex + 1);

      setIsGenerating(true);
      try {
        const assistantResponse = await getChatCompletion(messagesUpToEdited);
        const newAssistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: assistantResponse,
        };
        setMessages([...messagesUpToEdited, newAssistantMessage]);
      } catch (error) {
        console.error("Error generating response:", error);
      } finally {
        setIsGenerating(false);
      }
    },
    [messages]
  );

  const handleStartEditing = useCallback((id: string) => {
    setEditingMessageId(id);
  }, []);

  const handleCancelEditing = useCallback(() => {
    setEditingMessageId(null);
  }, []);

  const handleStopGeneration = useCallback(() => {
    console.log("Stop generation requested"); // Debug log
    setIsGenerating(false);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <MessageList
        messages={messages}
        onStartEditing={handleStartEditing}
        editingMessageId={editingMessageId}
        onEditMessage={handleEditMessage}
        onCancelEditing={handleCancelEditing}
      />
      <MessageInput
        onSendMessage={handleSendMessage}
        onStopGeneration={handleStopGeneration}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default Chat;

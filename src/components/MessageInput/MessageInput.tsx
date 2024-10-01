"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onStopGeneration: () => void;
  isGenerating: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onStopGeneration,
  isGenerating,
}) => {
  const [editorContent, setEditorContent] = useState("");
  const [isEditorVisible, setIsEditorVisible] = useState(true); // Changed to true for debugging
  const [isUserActive, setIsUserActive] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  const handleUserActivity = useCallback(() => {
    setIsUserActive(true);
    setIsEditorVisible(true);
  }, []);

  useEffect(() => {
    const handleKeyPress = () => handleUserActivity();

    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("mousemove", handleUserActivity);

    const inactivityTimeout = setTimeout(() => {
      if (!isUserActive) {
        setIsEditorVisible(false);
      }
    }, 5000);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("mousemove", handleUserActivity);
      clearTimeout(inactivityTimeout);
    };
  }, [isUserActive, handleUserActivity]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = quillRef.current?.getEditor().getText().trim();
      if (text) {
        console.log("Calling onSendMessage with:", text); // Debug log
        onSendMessage(text);
        setEditorContent("");
        if (quillRef.current) {
          quillRef.current.getEditor().setText("");
        }
      }
    },
    [onSendMessage]
  );

  return (
    <div>
      {isEditorVisible && (
        <form
          onSubmit={handleSubmit}
          className="p-4"
          aria-label="Message Input">
          <div className="flex items-center border border-gray-800 bg-background rounded-lg px-4 py-2">
            <div className="flex-1">
              <ReactQuill
                ref={quillRef}
                value={editorContent}
                onChange={setEditorContent}
                placeholder="Type '/' for quick access to the command menu. Use '||' to enter multiple prompts."
                readOnly={isGenerating}
              />
            </div>
            {isGenerating ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="text-white bg-red-500 px-4 py-2 rounded-r-lg ml-2">
                Stop
              </button>
            ) : (
              <button
                type="submit"
                className="text-white bg-blue-500 px-4 py-2 rounded-r-lg ml-2">
                Send
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default MessageInput;

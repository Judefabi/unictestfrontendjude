import React, { useState, useRef, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onStopGeneration: () => void;
  isGenerating: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onStopGeneration,
  isGenerating,
}) => {
  const [editorContent, setEditorContent] = useState("");
  const quillRef = useRef<ReactQuill>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = quillRef.current?.getEditor().getText().trim();
      if (text) {
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
    <form onSubmit={handleSubmit} className="p-4" aria-label="Message Input">
      <div className="flex items-center border border-gray-800 bg-background rounded-lg px-4 py-2">
        <div className="flex-1">
          <ReactQuill
            ref={quillRef}
            value={editorContent}
            onChange={setEditorContent}
            placeholder="Type your message..."
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
  );
};

export default MessageInput;

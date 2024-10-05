import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface MessageEditInputProps {
  initialContent: string;
  onSave: (newContent: string) => void;
  onCancel: () => void;
}

const MessageEditInput: React.FC<MessageEditInputProps> = ({
  initialContent,
  onSave,
  onCancel,
}) => {
  const [editContent, setEditContent] = useState(initialContent);
  const quillRef = useRef<ReactQuill>(null);

  const handleSave = () => {
    const plainText = quillRef.current?.getEditor().getText().trim(); // Get plain text without HTML tags...with formatting, we would pass html tags too
    onSave(plainText || ""); // Pass plain text content
  };

  return (
    <div className="mb-4">
      <ReactQuill
        ref={quillRef}
        value={editContent}
        onChange={setEditContent}
        placeholder="Edit your message..."
      />
      <div className="mt-2">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-black px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MessageEditInput;

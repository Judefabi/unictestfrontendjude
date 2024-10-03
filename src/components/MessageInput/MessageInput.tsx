import React, { useState, useRef, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CommandsModal from "../CommandsModal/CommandsModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  // console.log("Generating", isGenerating);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = quillRef.current?.getEditor().getText().trim();
      if (text) {
        await onSendMessage(text);
        setEditorContent("");
        if (quillRef.current) {
          quillRef.current.getEditor().setText("");
        }
      }
    },
    [onSendMessage]
  );

  const handleInsertCommand = (command: string) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const cursorPosition = editor.getSelection()?.index || 0;
      editor.insertText(cursorPosition, command);
      setEditorContent(editor.getText());
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4" aria-label="Message Input">
        <div className="flex items-center border border-gray-800 bg-background rounded-lg px-4 py-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-blue-500 mr-2">
            /
          </button>
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
      <CommandsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInsert={handleInsertCommand}
      />
    </>
  );
};

export default MessageInput;

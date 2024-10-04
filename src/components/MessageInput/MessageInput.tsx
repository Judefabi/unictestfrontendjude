import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FiSend } from "react-icons/fi";
import { RiSlashCommands2 } from "react-icons/ri";
import { IoIosAdd, IoMdPerson, IoMdFlash, IoMdCode } from "react-icons/io";
import { BiSolidQuoteLeft } from "react-icons/bi";
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

  // Add event listener for "/" key press to trigger modal
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor(); // Get Quill editor instance
      editor.root.addEventListener("keydown", handleKeyDown); // Add keydown event listener

      return () => {
        // Cleanup event listener on unmount
        editor.root.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "/") {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

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
      const range = editor.getSelection();
      if (!range) {
        editor.focus();
        const length = editor.getLength();
        editor.setSelection(length, 0);
      }
      const newRange = editor.getSelection();
      if (newRange) {
        editor.insertText(newRange.index, command);
        editor.setSelection(newRange.index + command.length);
        setEditorContent(editor.getText());
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-[960px]"
        aria-label="Message Input">
        {/* Input Container */}
        <div className="border border-gray-800 bg-background rounded-lg flex items-center px-4 py-2">
          {/* Input area (ReactQuill) */}
          <div className="flex-1">
            <ReactQuill
              ref={quillRef}
              value={editorContent}
              onChange={setEditorContent}
              placeholder="Type your message..."
              readOnly={isGenerating}
              className="border-none"
            />
          </div>

          {/* Send button */}
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
              className="flex items-center space-x-2 text-white px-4 py-2">
              <span>Send</span>
              <FiSend className="text-lg" />
            </button>
          )}
        </div>

        <div className="flex mt-2 space-x-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="text-white flex font-semibold text-label-large items-center space-x-2">
            <RiSlashCommands2 className="text-lg" />
            <span>Command</span>
          </button>
          <button className="text-white flex font-semibold text-label-large items-center space-x-2">
            <BiSolidQuoteLeft className="text-lg" />
            <span>Prompts</span>
          </button>
          <button className="text-white flex font-semibold text-label-large items-center space-x-2">
            <IoMdPerson className="text-lg" />
            <span>Personas</span>
          </button>
          <button className="text-white flex font-semibold text-label-large items-center space-x-2">
            <IoIosAdd className="text-lg" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Modal for Commands */}
      <CommandsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInsert={handleInsertCommand}
      />
    </>
  );
};

export default MessageInput;

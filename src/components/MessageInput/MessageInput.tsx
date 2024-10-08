import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactQuill from "react-quill";
import { FiSend } from "react-icons/fi";
import { RiSlashCommands2 } from "react-icons/ri";
import { IoIosAdd, IoMdPerson } from "react-icons/io";
import { BiSolidQuoteLeft } from "react-icons/bi";
import CommandsModal from "../CommandsModal/CommandsModal";
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

  // track f user presses the command key in this case "/" thus poping up the commands modal for better User experience
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "/") {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  // handle user subitting their prompt and thsu triggering the entire prompt lifecycle
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = quillRef.current?.getEditor().getText().trim(); // Get plain text without HTML tags...with formatting, we would pass html tags too
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

  // handles user inserting a url from the commands modal. in this we track the cursor position thus inserting the url where the user has their cursor. This ensures that the user prompt is promperly writen after scraping and thus the LL gets to understand the prompt
  const handleInsertCommand = (command: string) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection();

      if (!range) {
        editor.focus();
        const length = editor.getLength();
        editor.setSelection(length, 0); // Focus at the end if no selection
      }

      const newRange = editor.getSelection();

      if (newRange) {
        editor.insertText(newRange.index, command);
        editor.setSelection({
          index: newRange.index + command.length,
          length: 0, // This ensures that the cursor is placed after the inserted text
        });
        setEditorContent(editor.getText());
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-[960px] space-y-4"
        aria-label="Message Input">
        {/* Input Container */}
        <div className="border border-[#797979] bg-background rounded-lg flex items-end px-4 py-2">
          {/* Input area (ReactQuill) */}
          <div className="flex-1">
            <ReactQuill
              ref={quillRef}
              value={editorContent}
              onChange={setEditorContent}
              placeholder="Type '/' for quick access to the command menu. Use '||' to enter multiple prompts."
              readOnly={isGenerating}
              className="custom-quill-editor"
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

        {/* These are teh extra input options. I opted not to give them their own component to reduce complexity but in cases where every button has a function, using a separet component will make it easier to handle and mantain clean code */}
        <div className="flex justify-between items-center">
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
          <div className="text-muted-foreground font-semibold">32/618</div>
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

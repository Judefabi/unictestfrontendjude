"use client";
import React, { useState, useEffect } from "react";
import Draft, { Editor, EditorState, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";

// Reusable emptyContentState to avoid SSR issues
const emptyContentState = Draft.convertFromRaw({
  entityMap: {},
  blocks: [
    {
      text: "",
      key: "foo",
      type: "unstyled",
      entityRanges: [],
      depth: 0,
      inlineStyleRanges: [],
    },
  ],
});

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(emptyContentState)
  );

  // Function to handle user input
  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);

    // Detect if user is typing
    const text = newEditorState.getCurrentContent().getPlainText();
  };

  // Function to handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contentState = editorState.getCurrentContent();
    const text = contentState.getPlainText().trim();

    if (text) {
      onSendMessage(text);
      setEditorState(EditorState.createWithContent(emptyContentState));
    }
  };


  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex items-center border border-gray-800 bg-background rounded-l-lg px-4 py-2">
        <div className="flex-1">
          
          <Editor
            editorState={editorState}
            onChange={handleEditorChange}
            placeholder="Type '/' for quick access to the command menu. Use '||' to enter multiple prompts."
          />
        </div>
        <button
          type="submit"
          className="text-foreground px-4 py-2 rounded-r-lg">
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;

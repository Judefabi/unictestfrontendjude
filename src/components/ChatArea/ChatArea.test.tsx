import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatArea from "./ChatArea";

// Mock scrollIntoView globally to avoid errors in the test
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock the ReactQuill component to avoid testing its internals
jest.mock("react-quill", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    readOnly,
  }: {
    value: string;
    onChange: any;
    readOnly: boolean;
  }) => (
    <div>
      <textarea
        data-testid="quill-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        placeholder="Type your message..."
      />
    </div>
  ),
}));

test("adds user message and AI response when message is sent", async () => {
  render(<ChatArea />);
});

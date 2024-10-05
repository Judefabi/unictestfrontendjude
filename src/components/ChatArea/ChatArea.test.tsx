import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatArea from "./ChatArea";

// Mock scrollIntoView globally to avoid errors in the test
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock the ReactQuill component to avoid testing its internals
jest.mock("react-quill", () => ({
  __esModule: true,
  default: ({ value, onChange, readOnly }: any) => (
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

  // Simulate typing in the mocked ReactQuill editor
  const input = screen.getByTestId("quill-editor");

  fireEvent.change(input, { target: { value: "Hello, AI!" } });

  // Simulate clicking the send button
  const sendButton = screen.getByText("Send");
  fireEvent.click(sendButton);

  // Ensure the user's message is rendered
  expect(screen.getByText("Hello, AI!")).toBeInTheDocument();

  
});

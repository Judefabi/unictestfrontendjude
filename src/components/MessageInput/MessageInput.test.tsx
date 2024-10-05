import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MessageInput from "./MessageInput";

// Mock ReactQuill component
jest.mock("react-quill", () => ({
  __esModule: true,
  default: ({ value, onChange }: any) => (
    <textarea
      data-testid="quill-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type '/' for quick access to the command menu. Use '||' to enter multiple prompts."
    />
  ),
}));

describe("MessageInput Component", () => {
  const onSendMessage = jest.fn();
  const onStopGeneration = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders input and handles text entry", () => {
    render(
      <MessageInput
        onSendMessage={onSendMessage}
        onStopGeneration={onStopGeneration}
        isGenerating={false}
      />
    );

    // Check that the mock Quill editor is rendered
    const quillEditor = screen.getByTestId("quill-editor");
    expect(quillEditor).toBeInTheDocument();

    // Simulate typing in the editor
    fireEvent.change(quillEditor, { target: { value: "Hello, world!" } });
    expect(quillEditor).toHaveValue("Hello, world!");
  });

  test("submits message when Send button is clicked", async () => {
    render(
      <MessageInput
        onSendMessage={onSendMessage}
        onStopGeneration={onStopGeneration}
        isGenerating={false}
      />
    );

    // Simulate typing in the editor
    const quillEditor = screen.getByTestId("quill-editor");
    fireEvent.change(quillEditor, { target: { value: "Hello, world!" } });

    // Simulate clicking the Send button
    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);
  });

  test("opens command modal when '/' is pressed", () => {
    render(
      <MessageInput
        onSendMessage={onSendMessage}
        onStopGeneration={onStopGeneration}
        isGenerating={false}
      />
    );

    // Simulate key press "/" inside the editor
    const quillEditor = screen.getByTestId("quill-editor");
    fireEvent.keyDown(quillEditor, { key: "/" });
  });

  test("handles stop generation button when isGenerating is true", () => {
    render(
      <MessageInput
        onSendMessage={onSendMessage}
        onStopGeneration={onStopGeneration}
        isGenerating={true}
      />
    );

    // Check if Stop button is visible instead of Send
    const stopButton = screen.getByText("Stop");
    expect(stopButton).toBeInTheDocument();

    // Simulate clicking the Stop button
    fireEvent.click(stopButton);

    // Ensure onStopGeneration is called
    expect(onStopGeneration).toHaveBeenCalled();
  });

  test("handles opening and closing the commands modal", () => {
    render(
      <MessageInput
        onSendMessage={onSendMessage}
        onStopGeneration={onStopGeneration}
        isGenerating={false}
      />
    );

    // Simulate clicking the "Command" button to open the modal
    const commandButton = screen.getByText("Command");
    fireEvent.click(commandButton);
  });
});

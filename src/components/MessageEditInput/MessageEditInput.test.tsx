import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MessageEditInput from "./MessageEditInput";

// Mock ReactQuill component indirectly as it doesnt easily allow direct testing
jest.mock("react-quill", () => ({
  __esModule: true,
  default: ({ value, onChange }: any) => (
    <textarea
      data-testid="quill-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe("MessageEditInput Component", () => {
  const onSave = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays initial content in the editor", () => {
    const initialContent = "Hello, world!";

    render(
      <MessageEditInput
        initialContent={initialContent}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  });

  test("calls onSave with plain text when save button is clicked", () => {
    const initialContent = "Hello, world!";

    render(
      <MessageEditInput
        initialContent={initialContent}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  });

  test("calls onCancel when the cancel button is clicked", () => {
    render(
      <MessageEditInput
        initialContent="Hello, world!"
        onSave={onSave}
        onCancel={onCancel}
      />
    );

    // Simulate clicking the cancel button
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Ensure that onCancel is called
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

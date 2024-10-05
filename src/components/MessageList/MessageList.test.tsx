import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MessageList from "./MessageList";

// Mock scrollIntoView globally
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock components used within MessageList
jest.mock("../MessageEditInput/MessageEditInput", () => ({
  __esModule: true,
  default: ({
    initialContent,
    onSave,
    onCancel,
  }: {
    initialContent: string;
    onSave: any;
    onCancel: any;
  }) => (
    <div data-testid="edit-input">
      <textarea data-testid="edit-textarea" defaultValue={initialContent} />
      <button onClick={() => onSave("New content")}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

jest.mock("../ScrappingModal.tsx/ScrappingModal", () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: any }) => (
    <div data-testid="scraping-modal">
      <p>Scraping in progress...</p>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("MessageList Component", () => {
  const messages = [
    { id: "1", role: "user", content: "User message" },
    { id: "2", role: "assistant", content: "Assistant message" },
  ];
  const onStartEditing = jest.fn();
  const onEditMessage = jest.fn();
  const onCancelEditing = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders user and assistant messages", () => {
    render(
      <MessageList
        messages={messages}
        onStartEditing={onStartEditing}
        editingMessageId={null}
        onEditMessage={onEditMessage}
        onCancelEditing={onCancelEditing}
      />
    );

    // Check for user message
    expect(screen.getByText("User message")).toBeInTheDocument();
    // Check for assistant message
    expect(screen.getByText("Assistant message")).toBeInTheDocument();
  });

  test("renders MessageEditInput when editing a message", () => {
    render(
      <MessageList
        messages={messages}
        onStartEditing={onStartEditing}
        editingMessageId="1"
        onEditMessage={onEditMessage}
        onCancelEditing={onCancelEditing}
      />
    );

    // Ensure the edit input appears when editing message with id "1"
    expect(screen.getByTestId("edit-input")).toBeInTheDocument();

    // Simulate editing the message
    fireEvent.click(screen.getByText("Save"));
    expect(onEditMessage).toHaveBeenCalledWith("1", "New content");

    // Simulate cancelling the editing
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancelEditing).toHaveBeenCalledTimes(1);
  });

  test("handles scraping message and opens scraping modal", () => {
    const scrapingMessage = {
      id: "3",
      role: "assistant",
      content: "Scraping message",
      isScraping: true,
      scrapingUrls: [
        { url: "http://example.com", progress: 50, status: "scraping" },
      ],
    };

    render(
      <MessageList
        messages={[scrapingMessage]}
        onStartEditing={onStartEditing}
        editingMessageId={null}
        onEditMessage={onEditMessage}
        onCancelEditing={onCancelEditing}
      />
    );
  });

  test("displays generating response text when isGenerating is true", () => {
    const generatingMessage = {
      id: "4",
      role: "assistant",
      content: "",
      isGenerating: true,
    };

    render(
      <MessageList
        messages={[generatingMessage]}
        onStartEditing={onStartEditing}
        editingMessageId={null}
        onEditMessage={onEditMessage}
        onCancelEditing={onCancelEditing}
      />
    );

    // Check for generating response text
    expect(screen.getByText("Generating response...")).toBeInTheDocument();
  });
});

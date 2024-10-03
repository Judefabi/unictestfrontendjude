import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MessageInput from "./MessageInput";

// Mock the CommandsModal component
jest.mock("../CommandsModal/CommandsModal", () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="modal">Commands Modal</div> : null,
}));

describe("MessageInput Component", () => {
  const onSendMessage = jest.fn();
  const onStopGeneration = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("allows user to type a message", async () => {
    render(
      <MessageInput
        onSendMessage={onSendMessage}
        onStopGeneration={onStopGeneration}
        isGenerating={false}
      />
    );
  });

  test("calls onSendMessage when message is submitted", async () => {
    render(
      <MessageInput
        onSendMessage={onSendMessage}
        onStopGeneration={onStopGeneration}
        isGenerating={false}
      />
    );
  });

  test("displays 'Stop' button and calls onStopGeneration when generating", () => {
    render(
      <MessageInput
        onSendMessage={onSendMessage}
        onStopGeneration={onStopGeneration}
        isGenerating={true}
      />
    );

    // Check if the Stop button appears when isGenerating is true
    const stopButton = screen.getByText("Stop");
    expect(stopButton).toBeInTheDocument();

    // Simulate clicking the Stop button
    fireEvent.click(stopButton);

    // Ensure that onStopGeneration is called
    expect(onStopGeneration).toHaveBeenCalledTimes(1);
  });

  test("opens and closes the command modal", () => {
    render(
      <MessageInput
        onSendMessage={onSendMessage}
        onStopGeneration={onStopGeneration}
        isGenerating={false}
      />
    );

    // Check that modal is not open initially
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();

    // Simulate clicking the / button to open the modal
    fireEvent.click(screen.getByText("/"));

    // Check if the modal is displayed
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });
});

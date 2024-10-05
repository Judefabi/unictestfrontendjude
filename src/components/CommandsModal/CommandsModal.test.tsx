import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommandsModal from "./CommandsModal";

describe("CommandsModal Component", () => {
  const onInsert = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders when isOpen is true and doesn't render when isOpen is false", () => {
    const { rerender } = render(
      <CommandsModal isOpen={false} onClose={onClose} onInsert={onInsert} />
    );
    // Ensure the modal is not visible when isOpen is false
    expect(screen.queryByText("Commands")).not.toBeInTheDocument();

    // Rerender with isOpen set to true
    rerender(
      <CommandsModal isOpen={true} onClose={onClose} onInsert={onInsert} />
    );

    // Ensure the modal is now visible
    expect(screen.getByText("Commands")).toBeInTheDocument();
  });

  test("handles URL input", () => {
    render(
      <CommandsModal isOpen={true} onClose={onClose} onInsert={onInsert} />
    );

    // Simulate typing a URL in the input
    const urlInput = screen.getByPlaceholderText("Enter URL");
    fireEvent.change(urlInput, { target: { value: "http://example.com" } });

    // Ensure the URL input reflects the new value
    expect(urlInput).toHaveValue("http://example.com");
  });

  test("handles search term input", () => {
    render(
      <CommandsModal isOpen={true} onClose={onClose} onInsert={onInsert} />
    );

    // Simulate typing a search term
    const searchInput = screen.getByPlaceholderText("Search Term");
    fireEvent.change(searchInput, { target: { value: "AI Tools" } });

    // Ensure the search term input reflects the new value
    expect(searchInput).toHaveValue("AI Tools");
  });

  test("toggles advanced options visibility", () => {
    render(
      <CommandsModal isOpen={true} onClose={onClose} onInsert={onInsert} />
    );

    // Initially, advanced options should not be visible
    expect(screen.queryByText("Max Execution Time")).not.toBeInTheDocument();

    // Simulate clicking the "Advanced" button to show advanced options
    const advancedButton = screen.getAllByText("Advanced")[1]; // Pick the second one related to URL
    fireEvent.click(advancedButton);

    // Ensure advanced options are now visible
    expect(screen.getByText("Max Execution Time")).toBeInTheDocument();

    // Simulate clicking the "Advanced" button again to hide advanced options
    fireEvent.click(advancedButton);

    // Ensure advanced options are now hidden again
    expect(screen.queryByText("Max Execution Time")).not.toBeInTheDocument();
  });

  test("generates correct command and calls onInsert when Insert button is clicked", () => {
    render(
      <CommandsModal isOpen={true} onClose={onClose} onInsert={onInsert} />
    );

    // Simulate typing a URL in the input
    const urlInput = screen.getByPlaceholderText("Enter URL");
    fireEvent.change(urlInput, { target: { value: "http://example.com" } });

    // Simulate clicking the "Insert" button
    const insertButton = screen.getAllByText("Insert")[1]; // Pick the second one related to URL
    fireEvent.click(insertButton);

    // Ensure onInsert is called with the correct command
    expect(onInsert).toHaveBeenCalledWith(
      "[include-url: http://example.com max_execution_time:300 filter:true store:true]"
    );

    // Ensure onClose is called after insertion
    expect(onClose).toHaveBeenCalled();
  });

  test("closes the modal when the close icon is clicked", () => {
    render(
      <CommandsModal isOpen={true} onClose={onClose} onInsert={onInsert} />
    );
  });
});

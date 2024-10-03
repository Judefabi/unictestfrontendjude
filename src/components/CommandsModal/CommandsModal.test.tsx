import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommandsModal from "./CommandsModal";

describe("CommandsModal Component", () => {
  const onInsert = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders modal when isOpen is true and hides when isOpen is false", () => {
    // Render when isOpen is false
    const { rerender } = render(
      <CommandsModal isOpen={false} onClose={onClose} onInsert={onInsert} />
    );
    expect(screen.queryByText("Insert Custom Command")).not.toBeInTheDocument();

    // Render when isOpen is true
    rerender(
      <CommandsModal isOpen={true} onClose={onClose} onInsert={onInsert} />
    );
    expect(screen.getByText("Insert Custom Command")).toBeInTheDocument();
  });

  test("handles URL input", () => {
    render(
      <CommandsModal isOpen={true} onClose={onClose} onInsert={onInsert} />
    );

    // Simulate typing in the URL input
    const urlInput = screen.getByPlaceholderText("Enter URL");
    fireEvent.change(urlInput, { target: { value: "http://example.com" } });

    // Ensure the URL input reflects the new value
    expect(urlInput).toHaveValue("http://example.com");
  });

  test("toggles advanced options and handles advanced input", () => {
    render(
      <CommandsModal isOpen={true} onClose={onClose} onInsert={onInsert} />
    );

    // Initially, advanced options should not be visible
    expect(
      screen.queryByPlaceholderText("Max Execution Time")
    ).not.toBeInTheDocument();

    // Simulate checking the advanced options checkbox
    const advancedCheckbox = screen.getByLabelText("Advanced Options");
    fireEvent.click(advancedCheckbox);

    // Ensure advanced options are now visible
    expect(
      screen.getByPlaceholderText("Max Execution Time")
    ).toBeInTheDocument();

    // Simulate entering values for the advanced fields
    const maxTimeInput = screen.getByPlaceholderText("Max Execution Time");
    fireEvent.change(maxTimeInput, { target: { value: "500" } });
    expect(maxTimeInput).toHaveValue(500);

    // Simulate toggling Filter and Store checkboxes
    const filterCheckbox = screen.getByLabelText("Filter");
    fireEvent.click(filterCheckbox);
    expect(filterCheckbox).not.toBeChecked();

    const storeCheckbox = screen.getByLabelText("Store");
    fireEvent.click(storeCheckbox);
    expect(storeCheckbox).not.toBeChecked();
  });

  test("calls onInsert with the correct command string when Insert button is clicked", () => {
    render(
      <CommandsModal isOpen={true} onClose={onClose} onInsert={onInsert} />
    );

    // Simulate entering a URL
    const urlInput = screen.getByPlaceholderText("Enter URL");
    fireEvent.change(urlInput, { target: { value: "http://example.com" } });

    // Simulate clicking the Insert button
    fireEvent.click(screen.getByText("Insert"));

    // Ensure onInsert is called with the correct command string
    expect(onInsert).toHaveBeenCalledWith(
      "[include-url: http://example.com max_execution_time:300 filter:true store:true]"
    );

    // Ensure onClose is called after insert
    expect(onClose).toHaveBeenCalled();
  });

  test("handles advanced options in the command string when Insert is clicked", () => {
    render(
      <CommandsModal isOpen={true} onClose={onClose} onInsert={onInsert} />
    );

    // Simulate entering a URL
    const urlInput = screen.getByPlaceholderText("Enter URL");
    fireEvent.change(urlInput, { target: { value: "http://example.com" } });

    // Enable advanced options and modify their values
    const advancedCheckbox = screen.getByLabelText("Advanced Options");
    fireEvent.click(advancedCheckbox);

    const maxTimeInput = screen.getByPlaceholderText("Max Execution Time");
    fireEvent.change(maxTimeInput, { target: { value: "600" } });

    const filterCheckbox = screen.getByLabelText("Filter");
    fireEvent.click(filterCheckbox);

    const storeCheckbox = screen.getByLabelText("Store");
    fireEvent.click(storeCheckbox);

    // Simulate clicking the Insert button
    fireEvent.click(screen.getByText("Insert"));

    // Ensure onInsert is called with the updated advanced options in the command string
    expect(onInsert).toHaveBeenCalledWith(
      "[include-url: http://example.com max_execution_time:600 filter:false store:false]"
    );

    // Ensure onClose is called after insert
    expect(onClose).toHaveBeenCalled();
  });

  test("calls onClose when the Cancel button is clicked", () => {
    render(
      <CommandsModal isOpen={true} onClose={onClose} onInsert={onInsert} />
    );

    // Simulate clicking the Cancel button
    fireEvent.click(screen.getByText("Cancel"));

    // Ensure onClose is called
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

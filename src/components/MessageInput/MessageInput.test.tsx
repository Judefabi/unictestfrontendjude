// src/components/MessageInput/MessageInput.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MessageInput from "./MessageInput"; 
import "@testing-library/jest-dom";
import ReactQuill from "react-quill";

jest.mock("react-quill", () => {
  const MockQuill = React.forwardRef((props, ref) => (
    <div>
      <textarea
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        value={props.value}
      />
    </div>
  ));
  MockQuill.displayName = "ReactQuill";
  return MockQuill;
});

describe("MessageInput Component", () => {
  const mockOnSendMessage = jest.fn();
  const mockOnStopGeneration = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("renders correctly when not generating", () => {
    render(
      <MessageInput
        onSendMessage={mockOnSendMessage}
        onStopGeneration={mockOnStopGeneration}
        isGenerating={false}
      />
    );

    // Check if the input area is rendered
    expect(
      screen.getByPlaceholderText(/Type '\/' for quick access/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Send/i)).toBeInTheDocument();
  });

  it("renders correctly when generating", () => {
    render(
      <MessageInput
        onSendMessage={mockOnSendMessage}
        onStopGeneration={mockOnStopGeneration}
        isGenerating={true}
      />
    );

    // Check if the Stop button is rendered
    expect(screen.getByText(/Stop/i)).toBeInTheDocument();
    expect(screen.queryByText(/Send/i)).not.toBeInTheDocument();
  });

  it("calls onSendMessage with the correct content when submitted", () => {
    render(
      <MessageInput onSendMessage={mockOnSendMessage} isGenerating={false} onStopGeneration={function (): void {
        throw new Error("Function not implemented.");
      } } />
    );
  });


  it("calls onStopGeneration when the Stop button is clicked", () => {
    render(
      <MessageInput
        onSendMessage={mockOnSendMessage}
        onStopGeneration={mockOnStopGeneration}
        isGenerating={true}
      />
    );

    fireEvent.click(screen.getByText(/Stop/i));

    expect(mockOnStopGeneration).toHaveBeenCalledTimes(1);
  });
});

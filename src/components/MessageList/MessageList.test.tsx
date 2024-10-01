import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MessageList from "./MessageList"; 

describe("MessageList Component", () => {
  const mockMessages = [
    { id: "1", role: "user", content: "Hello, how are you?" },
    { id: "2", role: "assistant", content: "I am fine, thank you!" },
    { id: "3", role: "user", content: "What can you do?" },
  ];

  it("renders correctly with messages", () => {
    render(<MessageList messages={mockMessages} />);

    // Check if the messages are rendered
    expect(screen.getByText(/Hello, how are you?/i)).toBeInTheDocument();
    expect(screen.getByText(/I am fine, thank you!/i)).toBeInTheDocument();
    expect(screen.getByText(/What can you do?/i)).toBeInTheDocument();
  });

  it("applies correct styles based on message role", () => {
    render(<MessageList messages={mockMessages} />);

    // Check user message styling
    const userMessage = screen.getByText(/Hello, how are you?/i).parentElement;
    expect(userMessage).toHaveClass("text-right");

    // Check assistant message styling
    const assistantMessage = screen.getByText(
      /I am fine, thank you!/i
    ).parentElement;
    expect(assistantMessage).toHaveClass("text-left");
  });

  it("renders correctly with no messages", () => {
    render(<MessageList messages={[]} />);

    // Ensure no messages are rendered
    expect(screen.queryByText(/Hello, how are you?/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/I am fine, thank you!/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/What can you do?/i)).not.toBeInTheDocument();
  });
});

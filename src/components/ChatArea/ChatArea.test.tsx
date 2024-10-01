import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatArea from "./ChatArea";

const mockMessages = [
  { type: "user" as const, content: "Hello" },
  { type: "bot" as const, content: "Hi there!" },
];

const mockOnSendMessage = jest.fn();

describe("ChatInterface", () => {
  it("renders MessageList and MessageInput", () => {
    render(
      <ChatArea
        messages={mockMessages}
        onSendMessage={mockOnSendMessage}
      />
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type your message...")
    ).toBeInTheDocument();
  });
});

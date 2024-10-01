import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatArea from "./ChatArea";

const mockMessages = [
  { type: "user" as const, content: "Hello" },
  { type: "bot" as const, content: "Hi there!" },
];

const mockOnSendMessage = jest.fn();

describe("ChatArea Component", () => {
  it("renders MessageList and MessageInput", async () => {
    render(
      <ChatArea messages={mockMessages} onSendMessage={mockOnSendMessage} />
    );

    // Check if the user message is rendered
    expect(screen.getByText("Hello")).toBeInTheDocument();

    // Check if the bot message is rendered
    expect(screen.getByText("Hi there!")).toBeInTheDocument();

    // Check if the placeholder text is rendered
    expect(
      screen.getByText(/Type '\/' for quick access to the command menu/i)
    ).toBeInTheDocument();
  });
});

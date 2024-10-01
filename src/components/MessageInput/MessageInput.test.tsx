// src/components/MessageInput/MessageInput.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import MessageInput from "./MessageInput"; 
import "@testing-library/jest-dom";

describe("MessageInput Component", () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the editor and send button", () => {
    // Check if the placeholder text is rendered correctly
    expect(
      screen.getByText(/Type '\/' for quick access to the command menu/i)
    ).toBeInTheDocument();

    // Check if the send button is rendered
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeInTheDocument();
  });
});

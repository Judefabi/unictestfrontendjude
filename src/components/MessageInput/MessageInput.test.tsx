import React from "react";
import { render, screen } from "@testing-library/react";; 
import "@testing-library/jest-dom";
import MessageInput from "./MessageInput";

describe("MessageInput Component", () => {
  it("renders input field and send button", () => {
    // Render the component. We are just checking for renders for the component as we will be using draft for rich text
    render(<MessageInput onSendMessage={jest.fn()} />);

    // Check if input and button are in the document
    expect(
      screen.getByPlaceholderText("Type your message...")
    ).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });
});

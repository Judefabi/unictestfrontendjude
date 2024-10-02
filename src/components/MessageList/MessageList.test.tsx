import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MessageList from "./MessageList";

// Define the Message type
type Message = {
  id: string;
  role: "user" | "assistant"; // Define role as a union type
  content: string;
};

describe("MessageList Component", () => {
  const messages: Message[] = [
    { id: "1", role: "user", content: "Hello" },
    { id: "2", role: "assistant", content: "Hi there!" },
    { id: "3", role: "user", content: "How are you?" },
  ];

  test("renders messages correctly", () => {
    render(<MessageList messages={messages} />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
    expect(screen.getByText("How are you?")).toBeInTheDocument();
  });

  test("renders code block with syntax highlighting", () => {
    const codeMessage: Message[] = [
      {
        id: "4",
        role: "user",
        content: '```javascript\nconsole.log("Hello World");\n```',
      },
    ];
    render(<MessageList messages={codeMessage} />);

    // Using regex to match the code line
    expect(
      screen.getByText(/console\.log\("Hello World"\);/)
    ).toBeInTheDocument();

    // Optional: debug to inspect the rendered output
    screen.debug();
  });
});

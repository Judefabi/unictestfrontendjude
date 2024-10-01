import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MessageList from "./MessageList";

const mockMessages = [
  { type: "user" as const, content: "Hello" },
  { type: "bot" as const, content: "Hi there!" },
];

describe("MessageList", () => {
  it("renders messages correctly", () => {
    render(<MessageList messages={mockMessages} />);

    expect(screen.getByText("Hello")).toHaveClass("bg-blue-500");
    expect(screen.getByText("Hi there!")).toHaveClass("bg-white");
  });
});

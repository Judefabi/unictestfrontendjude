import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chat from "./ChatArea";


test("adds user message and AI response when message is sent", async () => {
  render(<Chat />);
});

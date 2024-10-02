// MessageInput.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import MessageInput from './MessageInput';

describe('MessageInput Component', () => {
  const onSendMessageMock = jest.fn();
  const onStopGenerationMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  test('renders the editor when visible', () => {
    render(
      <MessageInput onSendMessage={onSendMessageMock} onStopGeneration={onStopGenerationMock} isGenerating={false} />
    );

    expect(screen.getByLabelText(/message input/i)).toBeInTheDocument();
  });

  test("allows input of a message and triggers send", () => {
   render(
     <MessageInput
       onSendMessage={onSendMessageMock}
       onStopGeneration={onStopGenerationMock}
       isGenerating={false}
     />
   );

    
    const input = screen.getByRole("textbox", { hidden: true }); 
    fireEvent.focus(input); 

    fireEvent.input(input, { target: { innerHTML: "Hello, world!" } });

    // Find the submit button and trigger a click
    const sendButton = screen.getByRole("button", { name: /send/i });
    fireEvent.click(sendButton); // Simulate sending the message

    // Add your assertions here to verify the expected behavior
  });

  test('calls onStopGeneration when Stop button is clicked', () => {
    render(
      <MessageInput onSendMessage={onSendMessageMock} onStopGeneration={onStopGenerationMock} isGenerating={true} />
    );

    fireEvent.click(screen.getByText(/stop/i));
    expect(onStopGenerationMock).toHaveBeenCalled();
  });

  
});

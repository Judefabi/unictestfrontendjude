import axios from "axios";

const API_URL =
  "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct/v1/chat/completions";
const API_TOKEN = process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN;
const MAX_TOKENS = 4096;
const MAX_INPUT_TOKENS = MAX_TOKENS - 500;

interface Message {
  role: "user" | "assistant";
  content: string;
}

function estimateTokens(text: string): number {
  return text.split(/\s+/).length + text.split(/[.,!?;:]/).length - 1;
}

function trimInputMessages(messages: Message[]): Message[] {
  let totalTokens = 0;
  const reversedMessages = [...messages].reverse();
  const trimmedMessages: Message[] = [];
  let needsTrimming = false;

  const lastMessage = reversedMessages[0];
  totalTokens += estimateTokens(lastMessage.content);
  trimmedMessages.push(lastMessage);

  for (let i = 1; i < reversedMessages.length; i++) {
    const message = reversedMessages[i];
    const messageTokens = estimateTokens(message.content);

    if (totalTokens + messageTokens <= MAX_INPUT_TOKENS) {
      totalTokens += messageTokens;
      trimmedMessages.push(message);
    } else {
      needsTrimming = true;
      break;
    }
  }

  if (needsTrimming) {
    console.log(
      `Trimmed ${
        messages.length - trimmedMessages.length
      } messages due to token limit.`
    );
  }

  return trimmedMessages.reverse();
}

async function query(messages: Message[], signal: AbortSignal) {
  const response = await axios.post(
    API_URL,
    {
      model: "microsoft/Phi-3-mini-4k-instruct",
      messages: messages,
      max_tokens: 500,
      stream: false,
    },
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      signal: signal, // Include the abort signal here
    }
  );
  return response.data;
}
export async function getChatCompletion(
  messages: Message[],
  signal: AbortSignal,
  updateMessageDisplay: (content: string) => void // Function to update UI
): Promise<string> {
  console.log("getChatCompletion called", messages);

  const trimmedMessages = trimInputMessages(messages);
  const API_URL =
    "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct/v1/chat/completions";
  const API_TOKEN = process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN;

  let partialResponse = ""; // Store the response incrementally

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "microsoft/Phi-3-mini-4k-instruct",
        messages: trimmedMessages,
        max_tokens: 500,
        stream: true, // Enable streaming
      }),
      signal: signal, // Pass the abort signal to handle cancellation
    });

    if (!response.body) {
      throw new Error("Readable stream not supported");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const dataLines = chunk.split("\n").filter(Boolean); // Split chunk into lines

      for (const line of dataLines) {
        if (line === "data: [DONE]") {
          console.log("Stream done.");
          break;
        }

        if (line.startsWith("data: ")) {
          const json = JSON.parse(line.slice(6)); // Remove the 'data: ' prefix
          const contentDelta = json.choices?.[0]?.delta?.content;

          if (contentDelta && !partialResponse.endsWith(contentDelta)) {
            // Append only if the content is new to avoid duplication
            partialResponse += contentDelta;
            updateMessageDisplay(partialResponse); // Update the UI progressively
          }
        }
      }
    }

    return partialResponse; // Return the full response after streaming completes
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request aborted by user.");
      // Update the UI with whatever partial response was available before aborting
      updateMessageDisplay(partialResponse);
      return ""; // Return an empty string instead of partialResponse
    }
    console.error("Error getting chat completion:", error);
    return "Sorry, there was an error processing your request.";
  }
}


// export async function getChatCompletion(
//   messages: Message[],
//   signal: AbortSignal // Accept a second argument for aborting
// ): Promise<string> {
//   console.log("getChatCompletion called", messages);

//   const trimmedMessages = trimInputMessages(messages);

//   try {
//     const response = await query(trimmedMessages, signal); // Pass the signal here
//     console.log("Got response", response.choices[0].message.content);
//     return response.choices[0].message.content;
//   } catch (error) {
//     // Check if the error was due to abortion and return empty instead of custom errors
//     if (axios.isCancel(error)) {
//       console.log("Request aborted by user. No response returned.");
//       return ""; // Return an empty string if use cancelled the prompt
//     }

//     console.error("Error getting chat completion:", error);

//     if (axios.isAxiosError(error) && error.response?.data?.error) {
//       const errorMessage = error.response.data.error;

//       if (
//         errorMessage.includes("Input validation error") &&
//         errorMessage.includes("tokens")
//       ) {
//         return (
//           "I apologize, but the conversation history has become too long for me to process. " +
//           "I've preserved your most recent message but had to trim some earlier context. " +
//           "If this affects my understanding, please feel free to rephrase or provide additional context."
//         );
//       }

//       if (
//         errorMessage ===
//         "Request failed during generation: Server error: CANCELLED"
//       ) {
//         return "I'm sorry, but it seems the server is currently overloaded. Please try again in a moment.";
//       }
//     }

//     return "Sorry, I encountered an error while processing your request. Please try again later.";
//   }
// }

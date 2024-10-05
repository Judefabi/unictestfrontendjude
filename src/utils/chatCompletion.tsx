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

// async function query(messages: Message[], signal: AbortSignal) {
//   const response = await axios.post(
//     API_URL,
//     {
//       model: "microsoft/Phi-3-mini-4k-instruct",
//       messages: messages,
//       max_tokens: 500,
//       stream: false,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       signal: signal, // Include the abort signal here to control cancelling of requests globally
//     }
//   );
//   return response.data;
// }

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.log("Request aborted by user.");
        // Update the UI with whatever partial response was available before aborting
        updateMessageDisplay(partialResponse);
        return "Response generation Cancelled"; // Return an error message instead of partialResponse
      }
      console.error("Error getting chat completion:", error.message);
      return "Sorry, there was an error processing your request.";
    } else {
      // Handle cases where the error is not an instance of Error (unlikely in this case)
      console.error("Unknown error getting chat completion:", error);
      return "Sorry, an unknown error occurred.";
    }
  }
}

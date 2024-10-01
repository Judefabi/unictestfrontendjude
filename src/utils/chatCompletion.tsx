import axios from "axios";

const API_URL =
  "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct/v1/chat/completions";
const API_TOKEN = process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN;

interface Message {
  role: "user" | "assistant";
  content: string;
}

async function query(messages: Message[]) {
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
    }
  );
  return response.data;
}

export async function getChatCompletion(messages: Message[]): Promise<string> {
  try {
    const response = await query(messages);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error getting chat completion:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
}

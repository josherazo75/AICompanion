import OpenAI from "openai";
import { Message } from "@/lib/types";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = "gpt-4o";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

/**
 * Formats chat history for the OpenAI API
 */
function formatChatHistory(currentMessage: string, messageHistory: Message[] = []) {
  // System message to set the AI's behavior
  const messages = [
    {
      role: "system",
      content: "You are a helpful AI assistant. Provide concise, accurate, and helpful responses to the user's questions.",
    },
  ];

  // Add message history (converted to OpenAI format)
  if (messageHistory.length > 0) {
    messageHistory.forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });
  }

  // Add the current message
  messages.push({
    role: "user",
    content: currentMessage,
  });

  return messages;
}

/**
 * Generates a chat completion using the OpenAI API
 */
export async function generateChatCompletion(
  message: string,
  messageHistory: Message[] = []
): Promise<string> {
  try {
    if (!openai.apiKey) {
      throw new Error("OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.");
    }

    const formattedMessages = formatChatHistory(message, messageHistory);

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating chat completion:", error);
    throw new Error(
      error instanceof Error 
        ? `Failed to generate AI response: ${error.message}` 
        : "Failed to generate AI response"
    );
  }
}

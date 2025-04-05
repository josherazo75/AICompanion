import OpenAI from "openai";
import { franc } from "franc";
import langs from "langs";

// Define proper TypeScript interfaces
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

if (!OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function generateChatResponse(
  messages: ChatMessage[]
): Promise<string> {
  try {
    const latestUserMessage = messages
      .filter((msg): msg is ChatMessage & { role: "user" } => msg.role === "user")
      .pop()?.content || "";

    // Add fallback for short messages (franc needs at least 10 chars)
    const langCode = latestUserMessage.length > 10 
      ? franc(latestUserMessage) 
      : "eng";

    const language = langs.where("3", langCode)?.name || "English";

    const systemPrompt =
      language.toLowerCase().includes("spanish")
        ? "Eres un asistente útil que responde siempre en español."
        : "You are a helpful assistant that always replies in English.";

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || "No response available.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error("Failed to generate AI response");
  }
}

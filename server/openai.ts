import OpenAI from "openai";
import { franc } from "franc";
import langs from "langs";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function generateChatResponse(
  messages: { role: string; content: string }[]
): Promise<string> {
  try {
    const latestUserMessage =
      messages.filter((msg) => msg.role === "user").pop()?.content || "";

    const langCode = franc(latestUserMessage);
    const language = langs.where("3", langCode)?.name || "English";

    const systemPrompt =
      language.toLowerCase() === "spanish"
        ? "Eres un asistente útil que responde siempre en español."
        : "You are a helpful assistant that always replies in English.";

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "No response available.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error("Failed to generate AI response");
  }
}

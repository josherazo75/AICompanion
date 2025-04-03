import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertMessageSchema } from "@shared/schema";
import { generateChatResponse } from "./openai";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // ✅ Facebook Webhook verification
  const VERIFY_TOKEN = "je_verify_123";

  app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verified");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  });

  app.post("/webhook", (req, res) => {
    console.log("📥 Incoming webhook event:", JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  });

  // ✅ Get all messages for a conversation
  app.get("/api/messages", async (req, res) => {
    try {
      const conversationId = await storage.getOrCreateConversationId();
      const messages = await storage.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // ✅ Create a new message and get AI response
  app.post("/api/messages", async (req, res) => {
    try {
      if (!req.body.conversationId) {
        req.body.conversationId = crypto.randomUUID();
      }

      const messageData = insertMessageSchema.parse(req.body);
      const userMessage = await storage.createMessage(messageData);
      const messageHistory = await storage.getMessages(req.body.conversationId);

      const openaiMessages = messageHistory.map(msg => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content
      }));

      try {
        const aiResponseContent = await generateChatResponse(openaiMessages);

        const aiMessage = await storage.createMessage({
          content: aiResponseContent,
          role: "assistant",
          conversationId: req.body.conversationId
        });

        res.status(201).json({
          userMessage,
          aiMessage
        });
      } catch (aiError) {
        console.error("Error with AI response:", aiError);
        res.status(201).json({
          userMessage,
          error: "Failed to generate AI response"
        });
      }
    } catch (error) {
      console.error("Error creating message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // ✅ Get or create conversation ID
  app.get("/api/conversation", async (req, res) => {
    try {
      const conversationId = await storage.getOrCreateConversationId();
      res.json({ conversationId });
    } catch (error) {
      console.error("Error with conversation:", error);
      res.status(500).json({ message: "Failed to get conversation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

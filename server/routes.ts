import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertMessageSchema } from "@shared/schema";
import { generateChatResponse } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Get all messages for a conversation
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

  // Create a new message and get AI response
  app.post("/api/messages", async (req, res) => {
    try {
      // Validate request body
      const messageData = insertMessageSchema.parse(req.body);
      
      // Store user message
      const userMessage = await storage.createMessage(messageData);
      
      // Get conversation history for context
      const conversationId = await storage.getOrCreateConversationId();
      const messageHistory = await storage.getMessages(conversationId);
      
      // Format messages for OpenAI
      const openaiMessages = messageHistory.map(msg => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content
      }));
      
      try {
        // Generate AI response
        const aiResponseContent = await generateChatResponse(openaiMessages);
        
        // Store AI response
        const aiMessage = await storage.createMessage({
          content: aiResponseContent,
          role: "assistant",
          conversationId
        });
        
        // Return both messages
        res.status(201).json({
          userMessage,
          aiMessage
        });
      } catch (aiError) {
        // If AI generation fails, still return the user message
        // but with an error for the AI response
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

  // Get or create conversation ID
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

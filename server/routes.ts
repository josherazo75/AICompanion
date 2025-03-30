import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatCompletion } from "./services/openai";
import { v4 as uuidv4 } from "uuid";
import { chatCompletionRequestSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat completion endpoint
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = chatCompletionRequestSchema.parse(req.body);
      const { message, messageHistory = [] } = validatedData;
      
      // Generate a conversation ID if not present
      let conversationId = req.session?.conversationId;
      
      if (!conversationId) {
        conversationId = uuidv4();
        if (req.session) {
          req.session.conversationId = conversationId;
        }
        
        // Store the new conversation
        await storage.createConversation({
          conversationId,
        });
      }
      
      // Store the user message
      await storage.createMessage({
        content: message,
        role: "user",
        conversationId,
      });
      
      // Generate AI response
      const aiResponse = await generateChatCompletion(message, messageHistory);
      
      // Store the AI response
      if (aiResponse) {
        await storage.createMessage({
          content: aiResponse,
          role: "assistant",
          conversationId,
        });
      }
      
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Error in /api/chat:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          error: "Validation error", 
          details: validationError.message 
        });
      }
      
      res.status(500).json({ 
        error: "Failed to generate a response",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get conversation history
  app.get("/api/chat/history", async (req: Request, res: Response) => {
    try {
      const conversationId = req.session?.conversationId;
      
      if (!conversationId) {
        return res.json({ messages: [] });
      }
      
      const messages = await storage.getMessagesByConversationId(conversationId);
      res.json({ messages });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ 
        error: "Failed to fetch chat history",
        message: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

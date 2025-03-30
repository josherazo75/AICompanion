import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Chat messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  conversationId: varchar("conversation_id", { length: 50 }).notNull(),
});

// Conversation table to group messages
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  conversationId: varchar("conversation_id", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  role: true,
  conversationId: true,
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  conversationId: true,
});

// Types
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// Chat completion request/response schemas
export const chatCompletionRequestSchema = z.object({
  message: z.string().min(1),
  messageHistory: z.array(
    z.object({
      id: z.string(),
      content: z.string(),
      role: z.enum(["user", "assistant"]),
      timestamp: z.string(),
    })
  ).optional(),
});

export type ChatCompletionRequest = z.infer<typeof chatCompletionRequestSchema>;

import { 
  type Message, 
  type InsertMessage, 
  type Conversation, 
  type InsertConversation 
} from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

export interface IStorage {
  createMessage(message: InsertMessage): Promise<Message>;
  getMessageById(id: number): Promise<Message | undefined>;
  getMessagesByConversationId(conversationId: string): Promise<Message[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(conversationId: string): Promise<Conversation | undefined>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private conversations: Map<string, Conversation>;
  private currentMessageId: number;
  private currentConversationId: number;

  constructor() {
    this.messages = new Map();
    this.conversations = new Map();
    this.currentMessageId = 1;
    this.currentConversationId = 1;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      id,
      content: insertMessage.content,
      role: insertMessage.role,
      conversationId: insertMessage.conversationId,
      timestamp: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessageById(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => {
        if (a.timestamp instanceof Date && b.timestamp instanceof Date) {
          return a.timestamp.getTime() - b.timestamp.getTime();
        }
        return 0;
      });
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const now = new Date();
    const conversation: Conversation = {
      id,
      conversationId: insertConversation.conversationId,
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.set(conversation.conversationId, conversation);
    return conversation;
  }

  async getConversation(conversationId: string): Promise<Conversation | undefined> {
    return this.conversations.get(conversationId);
  }
}

export const storage = new MemStorage();

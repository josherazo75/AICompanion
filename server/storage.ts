import { Message, InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";
import db from "./db";

export class SQLiteStorage {
  async getMessages(conversationId: string): Promise<Message[]> {
    const rows = db
      .prepare(
        `SELECT * FROM messages WHERE conversationId = ? ORDER BY datetime(createdAt)`,
      )
      .all(conversationId);

    return rows.map((row) => ({
      id: row.id,
      role: row.role,
      content: row.content,
      conversationId: row.conversationId,
      createdAt: new Date(row.createdAt),
    }));
  }

  async getMessage(id: string): Promise<Message | undefined> {
    const row = db.prepare(`SELECT * FROM messages WHERE id = ?`).get(id);

    if (!row) return undefined;

    return {
      id: row.id,
      role: row.role,
      content: row.content,
      conversationId: row.conversationId,
      createdAt: new Date(row.createdAt),
    };
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();

    db.prepare(
      `
      INSERT INTO messages (id, role, content, conversationId, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `,
    ).run(id, message.role, message.content, message.conversationId, createdAt);

    return {
      id,
      ...message,
      createdAt: new Date(createdAt),
    };
  }

  async getOrCreateConversationId(): Promise<string> {
    // This can be improved later to support multiple users/sessions.
    return "default";
  }
}

export const storage = new SQLiteStorage();

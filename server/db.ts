// server/db.ts
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.resolve(__dirname, "../data.sqlite"));

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    conversationId TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

export default db;
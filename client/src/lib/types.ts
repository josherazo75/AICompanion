export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  messageHistory: Message[];
}

export interface ChatResponse {
  response: string;
}

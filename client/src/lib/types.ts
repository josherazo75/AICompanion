export interface Message {
  id: number;
  content: string;
  role: 'user' | 'assistant' | 'system';
  conversationId: string;
  createdAt: string | Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

import { apiRequest } from "./queryClient";
import { ChatRequest, ChatResponse } from "./types";

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await apiRequest("POST", "/api/chat", request);
  return response.json();
}

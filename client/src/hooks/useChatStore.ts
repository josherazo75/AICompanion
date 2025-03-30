import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function useChatStore() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMessage = useCallback(async (content: string) => {
    // Skip empty messages
    if (!content.trim()) return;
    
    // Create and add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: "user",
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLastUserMessage(content);
    setIsLoading(true);
    setHasError(false);
    
    try {
      const response = await apiRequest("POST", "/api/chat", {
        message: content,
        messageHistory: messages
      });
      
      const data = await response.json();
      
      // Create and add AI message
      const aiMessage: Message = {
        id: uuidv4(),
        content: data.response,
        role: "assistant",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setHasError(true);
      toast({
        title: "Error",
        description: "Failed to get a response from the AI assistant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, toast]);

  const retryLastMessage = useCallback(() => {
    if (lastUserMessage) {
      setHasError(false);
      sendMessage(lastUserMessage);
    }
  }, [lastUserMessage, sendMessage]);

  return {
    messages,
    isLoading,
    hasError,
    sendMessage,
    retryLastMessage
  };
}

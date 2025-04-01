import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { apiRequest } from "@/lib/queryClient";
import { Message } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get or create a conversation ID
  const { data: conversationData } = useQuery({
    queryKey: ['/api/conversation'],
    onSuccess: (data) => {
      setConversationId(data.conversationId);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not initialize conversation",
        variant: "destructive",
      });
    }
  });

  // Fetch messages
  const { 
    data: messages = [], 
    isLoading: isLoadingMessages,
    error: messagesError
  } = useQuery({
    queryKey: ['/api/messages', conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/messages");
      return response.json();
    },
  });


  // Send message mutation
  const { 
    mutate: sendMessage, 
    isPending: isSending,
    error: sendError
  } = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', '/api/messages', {
        content,
        role: 'user',
        conversationId: conversationId,
      });
      return response.json();
    },
    onSuccess: ({ userMessage, aiMessage }) => {
      queryClient.setQueryData(['/api/messages', conversationId], (old: Message[] = []) => [
        ...old,
        userMessage,
        aiMessage,
      ]);
    },


    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Welcome message when conversation starts
  useEffect(() => {
    if (conversationId && messages.length === 0 && !isLoadingMessages) {
      sendMessage("Hello, I'm starting a new conversation.");
    }
  }, [conversationId, messages, isLoadingMessages]);

  // Handle sending a new message
  const handleSendMessage = (content: string) => {
    if (content.trim() && !isSending) {
      sendMessage(content);
    }
  };

  // Combine all error states
  const error = messagesError || sendError 
    ? "Something went wrong. Please try again."
    : null;

  return (
    <div className="flex flex-col h-screen max-w-full">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto">
        <ChatMessages 
          messages={messages} 
          isLoading={isSending} 
          error={error} 
        />
      </div>

      <div className="px-2 pb-4 sm:px-4">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isSending} 
        />
      </div>
    </div>
  );
}

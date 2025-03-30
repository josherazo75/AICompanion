import { useEffect, useRef } from "react";
import { MessageItem } from "./message-item";
import { TypingIndicator } from "./typing-indicator";
import { Message } from "@/lib/types";
import { AlertCircle } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export function ChatMessages({ messages, isLoading, error }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or when loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        
        {isLoading && <TypingIndicator />}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg py-2 px-3 mx-auto">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

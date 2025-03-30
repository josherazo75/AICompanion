import { Message } from "@/lib/types";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import ErrorMessage from "./ErrorMessage";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
}

export default function MessageList({ 
  messages, 
  isLoading, 
  hasError, 
  onRetry 
}: MessageListProps) {
  // If there are no messages, display a welcome message
  if (messages.length === 0 && !isLoading && !hasError) {
    return (
      <ChatMessage
        message={{
          id: "welcome",
          content: "Hi there! I'm your AI assistant. How can I help you today?",
          role: "assistant",
          timestamp: new Date().toISOString()
        }}
      />
    );
  }

  return (
    <>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {isLoading && <TypingIndicator />}
      
      {hasError && <ErrorMessage onRetry={onRetry} />}
    </>
  );
}

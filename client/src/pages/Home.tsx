import { useRef, useEffect } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import MessageList from "@/components/MessageList";
import useChatStore from "@/hooks/useChatStore";
import useTheme from "@/hooks/useTheme";

export default function Home() {
  const { messages, isLoading, hasError, sendMessage, retryLastMessage } = useChatStore();
  const { isDarkMode } = useTheme();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading, hasError]);

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
      <ChatHeader />
      
      <main className="pt-16 pb-20 h-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div 
            ref={messageContainerRef}
            className="message-area py-6 h-full overflow-y-auto"
          >
            <MessageList 
              messages={messages} 
              isLoading={isLoading} 
              hasError={hasError} 
              onRetry={retryLastMessage}
            />
          </div>
        </div>
      </main>
      
      <ChatInput 
        onSendMessage={sendMessage} 
        disabled={isLoading} 
      />
    </div>
  );
}

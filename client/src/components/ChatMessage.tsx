import { Message } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { CircleInfo, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  // Format message with paragraphs
  const formatContent = (content: string) => {
    return content.split("\n\n").map((paragraph, index) => (
      <p key={index} className={`text-sm ${index > 0 ? "mt-2" : ""}`}>
        {paragraph}
      </p>
    ));
  };

  return (
    <div className={`flex items-start mb-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <Avatar className="h-10 w-10 bg-primary text-white">
            <CircleInfo className="h-6 w-6" />
          </Avatar>
        </div>
      )}
      
      <div 
        className={`flex-1 p-4 max-w-3xl ${
          isUser 
            ? "rounded-t-2xl rounded-bl-2xl rounded-br-lg bg-secondary dark:bg-gray-700 text-gray-800 dark:text-white ml-auto" 
            : "rounded-t-2xl rounded-br-2xl rounded-bl-lg bg-neutral dark:bg-gray-800 text-white"
        }`}
      >
        {formatContent(message.content)}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <Avatar className="h-10 w-10 bg-gray-300 text-gray-600">
            <User className="h-6 w-6" />
          </Avatar>
        </div>
      )}
    </div>
  );
}

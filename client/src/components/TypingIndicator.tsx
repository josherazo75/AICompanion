import { Avatar } from "@/components/ui/avatar";
import { CircleInfo } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-start mb-4">
      <div className="flex-shrink-0 mr-3">
        <Avatar className="h-10 w-10 bg-primary text-white">
          <CircleInfo className="h-6 w-6" />
        </Avatar>
      </div>
      <div className="flex-1 rounded-t-2xl rounded-br-2xl rounded-bl-lg p-4 bg-neutral dark:bg-gray-800 text-white max-w-3xl">
        <div className="flex items-center space-x-1 px-1">
          <div className="typing-dot h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="typing-dot h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "200ms" }}></div>
          <div className="typing-dot h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "400ms" }}></div>
        </div>
      </div>
    </div>
  );
}

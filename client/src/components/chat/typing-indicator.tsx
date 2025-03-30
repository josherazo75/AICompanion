import { Cpu } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-start">
      <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
        <Cpu className="h-5 w-5 text-white" />
      </div>
      <div className="ml-2 bg-primary-light rounded-lg py-3 px-4">
        <div className="flex space-x-1">
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-[bounce_1.4s_infinite]" style={{ animationDelay: "0s" }} />
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-[bounce_1.4s_infinite]" style={{ animationDelay: "0.2s" }} />
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-[bounce_1.4s_infinite]" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
}

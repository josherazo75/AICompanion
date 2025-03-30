import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const hasInput = inputValue.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasInput || disabled) return;
    
    onSendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleClear = () => {
    setInputValue("");
  };

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="block w-full py-6 px-4 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={disabled}
            />
            {hasInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            disabled={!hasInput || disabled}
            className="inline-flex justify-center items-center rounded-lg px-4 py-6 bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Send message</span>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

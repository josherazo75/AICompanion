import { Avatar } from "@/components/ui/avatar";
import { CircleInfo, AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  onRetry: () => void;
}

export default function ErrorMessage({ onRetry }: ErrorMessageProps) {
  return (
    <div className="flex items-start mb-4">
      <div className="flex-shrink-0 mr-3">
        <Avatar className="h-10 w-10 bg-primary text-white">
          <CircleInfo className="h-6 w-6" />
        </Avatar>
      </div>
      <div className="flex-1 rounded-t-2xl rounded-br-2xl rounded-bl-lg p-4 bg-red-100 dark:bg-red-900 border border-red-500 text-gray-800 dark:text-gray-200 max-w-3xl">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-sm font-medium text-red-500">Sorry, I couldn't process your request</p>
        </div>
        <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
          There was an error connecting to the AI service. Please try again later.
        </p>
        <button
          onClick={onRetry}
          className="mt-2 text-sm font-medium text-primary hover:text-primary/90 focus:outline-none flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Retry
        </button>
      </div>
    </div>
  );
}

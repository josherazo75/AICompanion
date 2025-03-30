import { Cpu } from "lucide-react";

export function ChatHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold">AI Assistant</h1>
        </div>
      </div>
    </header>
  );
}

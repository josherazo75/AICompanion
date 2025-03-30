import { CircleInfo } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export default function ChatHeader() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 shadow fixed top-0 inset-x-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <CircleInfo className="h-8 w-8 text-primary" />
            <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
              AI Assistant
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

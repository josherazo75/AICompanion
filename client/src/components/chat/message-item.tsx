import { User, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUserMessage = message.role === "user";

  // Convert links and newlines
  const formatContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const textWithLinks = content.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${url}</a>`;
    });
    const textWithBreaks = textWithLinks.replace(/\n/g, "<br>");
    return (
      <p
        className="text-gray-800"
        dangerouslySetInnerHTML={{ __html: textWithBreaks }}
      />
    );
  };

  // Convert bullet lists
  const formatList = (content: string) => {
    if (!content.includes("\n- ") && !content.includes("\n* ")) {
      return formatContent(content);
    }

    const lines = content.split("\n");
    const formattedContent = [];
    let inList = false;
    let listItems: string[] = [];

    lines.forEach((line, index) => {
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(line.trim().substring(2));
      } else {
        if (inList) {
          formattedContent.push(
            <ul key={`list-${index}`} className="list-disc pl-5 mt-1 space-y-1">
              {listItems.map((item, i) => (
                <li key={i}>{formatContent(item)}</li>
              ))}
            </ul>
          );
          inList = false;
        }
        if (line.trim()) {
          formattedContent.push(formatContent(line));
        }
      }
    });

    if (inList) {
      formattedContent.push(
        <ul key="list-end" className="list-disc pl-5 mt-1 space-y-1">
          {listItems.map((item, i) => (
            <li key={i}>{formatContent(item)}</li>
          ))}
        </ul>
      );
    }

    return <>{formattedContent}</>;
  };

  return (
    <div className={cn("flex items-end", isUserMessage ? "justify-end" : "justify-start")}>
      {!isUserMessage && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
          <Cpu className="h-5 w-5 text-white" />
        </div>
      )}

      <div
        className={cn(
          "rounded-xl px-4 py-2 shadow",
          "max-w-[90%] sm:max-w-[70%]", // 👈 responsive width
          isUserMessage ? "bg-gray-200 text-gray-900" : "bg-primary-light text-black"
        )}
      >
        {isUserMessage ? formatContent(message.content) : formatList(message.content)}

        <p className="text-xs text-right text-gray-500 mt-1">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isUserMessage && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2">
          <User className="h-5 w-5 text-gray-600" />
        </div>
      )}
    </div>
  );
}
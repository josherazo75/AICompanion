import { User, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUserMessage = message.role === "user";

  // Function to convert links to clickable elements and line breaks to <br>
  const formatContent = (content: string) => {
    // Replace URLs with clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const textWithLinks = content.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${url}</a>`;
    });

    // Replace newlines with <br>
    const textWithBreaks = textWithLinks.replace(/\n/g, '<br>');
    
    return <p className="text-gray-800" dangerouslySetInnerHTML={{ __html: textWithBreaks }} />;
  };

  // Format lists in AI responses
  const formatList = (content: string) => {
    if (!content.includes('\n- ') && !content.includes('\n* ')) {
      return formatContent(content);
    }

    const lines = content.split('\n');
    const formattedContent = [];
    let inList = false;
    let listItems: string[] = [];

    lines.forEach((line, index) => {
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
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

    // Add any remaining list items
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
    <div className={cn("flex items-start", isUserMessage && "justify-end")}>
      {!isUserMessage && (
        <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
          <Cpu className="h-5 w-5 text-white" />
        </div>
      )}
      <div 
        className={cn(
          "py-2 px-3 max-w-[85%] rounded-lg", 
          isUserMessage ? "mr-2 bg-secondary" : "ml-2 bg-primary-light"
        )}
      >
        {isUserMessage ? formatContent(message.content) : formatList(message.content)}
      </div>
      {isUserMessage && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-500" />
        </div>
      )}
    </div>
  );
}


import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatButtonProps {
  minimized: boolean;
  unreadCount: number;
  onClick: () => void;
}

const ChatButton = ({ minimized, unreadCount, onClick }: ChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`shadow-lg rounded-full w-16 h-16 flex items-center justify-center p-0 ${
        minimized 
          ? 'bg-retro-red hover:bg-retro-darkred text-retro-white' 
          : 'bg-retro-gray hover:bg-retro-gray/80 text-retro-white'
      }`}
    >
      {minimized ? (
        <div className="relative">
          <Bot className="h-7 w-7" />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-retro-yellow text-retro-gray rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {unreadCount}
            </div>
          )}
        </div>
      ) : (
        <X className="h-6 w-6" />
      )}
    </Button>
  );
};

export default ChatButton;

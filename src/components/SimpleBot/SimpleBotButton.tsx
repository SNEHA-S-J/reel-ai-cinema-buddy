
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SimpleBotButtonProps {
  isOpen: boolean;
  unreadCount: number;
  onClick: () => void;
}

const SimpleBotButton = ({ isOpen, unreadCount, onClick }: SimpleBotButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`shadow-lg rounded-full w-16 h-16 flex items-center justify-center p-0 ${
        !isOpen 
          ? 'bg-retro-yellow hover:bg-retro-yellow/80 text-retro-gray' 
          : 'bg-retro-gray hover:bg-retro-gray/80 text-retro-white'
      } z-50`}
    >
      {!isOpen ? (
        <div className="relative">
          <Bot className="h-7 w-7" />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-retro-red text-retro-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
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

export default SimpleBotButton;

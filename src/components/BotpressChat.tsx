
import { useBotpress } from "@/hooks/useBotpress";
import { BotpressChatProps } from "@/types/botpress";
import ChatButton from "./chat/ChatButton";
import QuickSuggestions from "./chat/QuickSuggestions";
import { conversationStarters } from "@/data/conversationStarters";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const BotpressChat = ({ showWidget = true }: BotpressChatProps) => {
  const { minimized, unreadCount, toggleChat, sendMessage, askMovieQuestion } = useBotpress(showWidget);
  const [movieTitle, setMovieTitle] = useState("");

  const handleMovieSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (movieTitle.trim()) {
      askMovieQuestion(movieTitle.trim());
      setMovieTitle("");
    }
  };

  if (!showWidget) return null;

  return (
    <>
      {/* Custom chat trigger button */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatButton 
          minimized={minimized} 
          unreadCount={unreadCount} 
          onClick={toggleChat} 
        />
      </div>

      {/* Quick suggestions and movie search when chat is minimized */}
      {minimized && (
        <div className="fixed bottom-24 right-6 z-40 max-w-xs">
          <div className="bg-retro-white p-4 rounded-sm border-2 border-retro-red mb-2">
            <form onSubmit={handleMovieSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask about a movie..."
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                className="flex-1 border-retro-red focus:border-retro-red"
              />
              <Button type="submit" size="sm" className="bg-retro-red hover:bg-retro-darkred">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>
          <QuickSuggestions 
            starters={conversationStarters} 
            onSelectSuggestion={sendMessage} 
          />
        </div>
      )}
    </>
  );
};

export default BotpressChat;

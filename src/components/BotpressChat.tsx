import { useBotpress } from "@/hooks/botpress";
import { BotpressChatProps } from "@/types/botpress";
import ChatButton from "./chat/ChatButton";
import QuickSuggestions from "./chat/QuickSuggestions";
import { conversationStarters } from "@/data/conversationStarters";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BotpressChat = ({ showWidget = true }: BotpressChatProps) => {
  const { minimized, unreadCount, toggleChat, sendMessage, askMovieQuestion, initialized } = useBotpress(showWidget);
  const [movieTitle, setMovieTitle] = useState("");
  const [userInput, setUserInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMovieSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (movieTitle.trim()) {
      askMovieQuestion(movieTitle.trim());
      setMovieTitle("");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      sendMessage(userInput.trim());
      setUserInput("");
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  if (!showWidget) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <ChatButton 
          minimized={minimized} 
          unreadCount={unreadCount} 
          onClick={toggleChat} 
        />
      </div>

      {minimized && initialized && (
        <div className="fixed bottom-24 right-6 z-40 w-80">
          <div className="bg-retro-white p-4 rounded-sm border-2 border-retro-red shadow-lg animate-fade-in">
            <div className="mb-4">
              <h3 className="font-mono text-retro-red font-bold flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" /> 
                Chat with Reel-AI
              </h3>
            </div>
            
            <form onSubmit={handleMovieSearch} className="flex gap-2 mb-4">
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

            <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
              <Textarea
                ref={textareaRef}
                placeholder="Type your message here..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="resize-none min-h-[60px] max-h-[120px] border-retro-red focus:border-retro-red"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <Button type="submit" className="bg-retro-red hover:bg-retro-darkred self-end">
                <Send className="w-4 h-4 mr-2" /> Send
              </Button>
            </form>
          </div>
          
          <div className="mt-2">
            <QuickSuggestions 
              starters={conversationStarters} 
              onSelectSuggestion={sendMessage} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BotpressChat;

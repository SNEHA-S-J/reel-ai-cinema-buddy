
import { useBotpress } from "@/hooks/useBotpress";
import { BotpressChatProps } from "@/types/botpress";
import ChatButton from "./chat/ChatButton";
import QuickSuggestions from "./chat/QuickSuggestions";
import { conversationStarters } from "@/data/conversationStarters";

const BotpressChat = ({ showWidget = true }: BotpressChatProps) => {
  const { minimized, unreadCount, toggleChat, sendMessage } = useBotpress(showWidget);

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

      {/* Quick suggestions when chat is minimized */}
      {minimized && (
        <div className="fixed bottom-24 right-6 z-40 max-w-xs">
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

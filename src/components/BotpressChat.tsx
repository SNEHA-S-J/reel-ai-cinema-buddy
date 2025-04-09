
import { useEffect, useState } from "react";
import { Bot, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BotpressWindow extends Window {
  botpressWebChat?: {
    init: (config: any) => void;
    sendEvent: (event: any) => void;
    onEvent: (event: string, handler: (payload: any) => void) => void;
  };
}

declare const window: BotpressWindow;

interface BotpressChatProps {
  showWidget?: boolean;
}

const BotpressChat = ({ showWidget = true }: BotpressChatProps) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // List of movie-related conversation starters
  const conversationStarters = [
    "What movies would you recommend for a rainy day?",
    "Show me some classic sci-fi films",
    "I'm in the mood for a good comedy",
    "Which movies won Oscars last year?",
    "What should I watch if I liked Inception?",
    "Tell me about upcoming movie releases",
    "Can you recommend a foreign film?",
    "What's a good family movie to watch?"
  ];

  useEffect(() => {
    if (!showWidget) return;

    // Load the Botpress webchat script
    const script = document.createElement('script');
    script.src = "https://cdn.botpress.cloud/webchat/v2.3/inject.js";
    script.async = true;
    
    // Handle script loading completion
    script.onload = () => {
      console.log("Botpress script loaded");
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      console.error("Failed to load Botpress script");
      toast({
        title: "AI Assistant Error",
        description: "Failed to load the AI assistant. Please refresh the page.",
        variant: "destructive"
      });
    };
    
    document.body.appendChild(script);

    // Cleanup function to remove the script when component unmounts
    return () => {
      if (window.botpressWebChat) {
        try {
          window.botpressWebChat.sendEvent({ type: "hide" });
        } catch (error) {
          console.error("Error hiding Botpress chat:", error);
        }
      }
      document.body.removeChild(script);
    };
  }, [showWidget, toast]);

  // Initialize webchat once script is loaded
  useEffect(() => {
    if (scriptLoaded && window.botpressWebChat && showWidget) {
      try {
        console.log("Initializing Botpress webchat");
        window.botpressWebChat.init({
          composerPlaceholder: "Ask Reel-AI about movies...",
          botConversationDescription: "Your personal movie recommendation assistant",
          botId: "NT36MHXW",
          hostUrl: "https://cdn.botpress.cloud/webchat/v2.3",
          messagingUrl: "https://messaging.botpress.cloud",
          clientId: "NT36MHXW",
          botName: "Reel-AI Assistant",
          useSessionStorage: true,
          stylesheet: "https://files.bpcontent.cloud/2025/04/06/16/20250406164749-NT36MHXW.json",
          enableConversationDeletion: true,
          hideWidget: true,  // We'll control widget visibility ourselves
          disableAnimations: false,
          closeOnEscape: false,
          showPoweredBy: false,
          className: "retro-botpress-webchat",
          containerWidth: "100%",
          layoutWidth: "100%",
        });

        // Set up event listeners
        window.botpressWebChat.onEvent('message', (payload) => {
          if (minimized && payload.direction === 'incoming') {
            setUnreadCount(prev => prev + 1);
            toast({
              title: "New message from Reel-AI",
              description: payload.payload?.text?.substring(0, 60) + (payload.payload?.text?.length > 60 ? "..." : ""),
              duration: 5000,
            });
          }
        });

        // Add a slight delay to make sure the widget is properly loaded
        setTimeout(() => {
          window.botpressWebChat?.sendEvent({
            type: 'message',
            payload: {
              type: 'text',
              text: 'Hello! I\'m Reel-AI, your movie recommendation assistant. How can I help you discover your next favorite film?'
            }
          });
        }, 1000);

      } catch (error) {
        console.error("Error initializing Botpress webchat:", error);
        toast({
          title: "AI Assistant Error",
          description: "There was an error initializing the AI assistant.",
          variant: "destructive"
        });
      }
    }
  }, [scriptLoaded, showWidget, toast, minimized]);

  const toggleChat = () => {
    if (window.botpressWebChat) {
      if (minimized) {
        window.botpressWebChat.sendEvent({ type: "show" });
        setUnreadCount(0);
      } else {
        window.botpressWebChat.sendEvent({ type: "hide" });
      }
      setMinimized(!minimized);
    }
  };

  const sendMessage = (message: string) => {
    if (window.botpressWebChat) {
      window.botpressWebChat.sendEvent({
        type: 'show'
      });
      setMinimized(false);
      
      setTimeout(() => {
        window.botpressWebChat?.sendEvent({
          type: 'message',
          payload: {
            type: 'text',
            text: message
          }
        });
      }, 300);
    }
  };

  if (!showWidget) return null;

  return (
    <>
      {/* Custom chat trigger button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
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
      </div>

      {/* Quick suggestions when chat is minimized */}
      {minimized && (
        <div className="fixed bottom-24 right-6 z-40 max-w-xs">
          <div className="bg-retro-white border-2 border-retro-red rounded-sm p-3 shadow-lg animate-fade-in retro-shadow">
            <h4 className="font-mono text-retro-red font-bold mb-2 text-sm">Ask Reel-AI:</h4>
            <div className="flex flex-wrap gap-2">
              {conversationStarters.slice(0, 3).map((starter, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(starter)}
                  className="text-xs bg-retro-yellow border border-retro-red text-retro-gray py-1 px-2 rounded-sm hover:bg-retro-yellow/80 font-mono transition-colors"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BotpressChat;

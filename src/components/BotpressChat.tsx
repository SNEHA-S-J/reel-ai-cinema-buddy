
import { useEffect, useState, useRef } from "react";
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
  const [initialized, setInitialized] = useState(false);
  const botInitialized = useRef(false);
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

  // Load Botpress script
  useEffect(() => {
    if (!showWidget) return;
    
    const existingScript = document.getElementById('botpressScript');
    if (existingScript) {
      console.log('Botpress script already loaded');
      setScriptLoaded(true);
      return;
    }

    // Load the Botpress webchat script
    const script = document.createElement('script');
    script.id = 'botpressScript';
    script.src = "https://cdn.botpress.cloud/webchat/v2.3/inject.js";
    script.async = true;
    
    // Handle script loading completion
    script.onload = () => {
      console.log("Botpress script loaded successfully");
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

    // Cleanup function
    return () => {
      // We don't remove the script on unmount to prevent reloading issues
    };
  }, [showWidget, toast]);

  // Initialize webchat once script is loaded
  useEffect(() => {
    if (scriptLoaded && window.botpressWebChat && showWidget && !botInitialized.current) {
      try {
        console.log("Initializing Botpress webchat");
        
        // Configure and initialize the bot
        window.botpressWebChat.init({
          composerPlaceholder: "Ask Reel-AI about movies...",
          botConversationDescription: "Your personal movie recommendation assistant",
          botId: "NT36MHXW",
          hostUrl: "https://cdn.botpress.cloud/webchat/v2.3",
          messagingUrl: "https://messaging.botpress.cloud",
          clientId: "NT36MHXW",
          botName: "Reel-AI Assistant",
          useSessionStorage: true,
          enableConversationDeletion: true,
          hideWidget: true,  // We'll control widget visibility ourselves
          disableAnimations: false,
          closeOnEscape: false,
          showPoweredBy: false,
          className: "retro-botpress-webchat",
          containerWidth: "380px",
          layoutWidth: "380px",
          safetyBehaviors: true
        });
        
        console.log("Botpress initialization complete");
        botInitialized.current = true;
        setInitialized(true);

        // Set up event listeners
        window.botpressWebChat.onEvent('message', (payload) => {
          console.log("Botpress message received:", payload);
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
          if (window.botpressWebChat) {
            console.log("Sending welcome message");
            window.botpressWebChat.sendEvent({
              type: 'message',
              payload: {
                type: 'text',
                text: 'Hello! I\'m Reel-AI, your movie recommendation assistant. How can I help you discover your next favorite film?'
              }
            });
          }
        }, 2000);

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
    if (window.botpressWebChat && initialized) {
      try {
        if (minimized) {
          console.log("Showing Botpress chat");
          window.botpressWebChat.sendEvent({ type: "show" });
          setUnreadCount(0);
        } else {
          console.log("Hiding Botpress chat");
          window.botpressWebChat.sendEvent({ type: "hide" });
        }
        setMinimized(!minimized);
      } catch (error) {
        console.error("Error toggling chat:", error);
        toast({
          title: "AI Assistant Error",
          description: "There was an error with the chat. Please refresh the page.",
          variant: "destructive"
        });
      }
    } else {
      console.warn("Botpress not initialized yet");
      toast({
        title: "AI Assistant Loading",
        description: "Please wait while the assistant initializes...",
      });
    }
  };

  const sendMessage = (message: string) => {
    if (window.botpressWebChat && initialized) {
      try {
        console.log("Sending message to Botpress:", message);
        window.botpressWebChat.sendEvent({
          type: 'show'
        });
        setMinimized(false);
        
        setTimeout(() => {
          if (window.botpressWebChat) {
            window.botpressWebChat.sendEvent({
              type: 'message',
              payload: {
                type: 'text',
                text: message
              }
            });
          }
        }, 300);
      } catch (error) {
        console.error("Error sending message to Botpress:", error);
        toast({
          title: "Message Error",
          description: "Could not send your message. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      console.warn("Cannot send message: Botpress not initialized");
      toast({
        title: "AI Assistant Loading",
        description: "Please wait while the assistant initializes...",
      });
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

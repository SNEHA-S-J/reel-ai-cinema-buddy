import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const useBotpress = (showWidget = true) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const botInitialized = useRef(false);
  const { toast } = useToast();

  // Load Botpress script
  useEffect(() => {
    if (!showWidget) return;
    
    const existingScript = document.getElementById('botpressScript');
    if (existingScript) {
      console.log('Botpress script already loaded');
      setScriptLoaded(true);
      return;
    }

    // Load the Botpress webchat script with the correct URL
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
        
        // Configure and initialize the bot using the shareable URL configuration
        window.botpressWebChat.init({
          configUrl: "https://files.bpcontent.cloud/2025/04/06/16/20250406164749-NT36MHXW.json",
          hostUrl: "https://cdn.botpress.cloud/webchat/v2.3",
          messagingUrl: "https://messaging.botpress.cloud",
          botId: "NT36MHXW",
          hideWidget: true,  // We'll control widget visibility ourselves
          className: "retro-botpress-webchat"
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

  return {
    minimized,
    unreadCount,
    initialized,
    toggleChat,
    sendMessage
  };
};

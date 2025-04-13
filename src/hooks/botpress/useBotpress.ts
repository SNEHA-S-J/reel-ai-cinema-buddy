
import { useState, useEffect } from "react";
import { useScriptLoader } from "./scriptLoader";
import { useBotInitializer } from "./botInitializer";
import { useChatInteractions } from "./chatInteractions";
import { UseBotpressResult } from "./types";

export const useBotpress = (showWidget = true): UseBotpressResult => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { loadScript } = useScriptLoader(showWidget);
  const { initialized, initializeBot, cleanup } = useBotInitializer();
  const { 
    minimized, 
    unreadCount, 
    setupMessageListener,
    toggleChat, 
    sendMessage, 
    askMovieQuestion 
  } = useChatInteractions(initialized);
  
  // Load Botpress script
  useEffect(() => {
    if (!showWidget) return;
    
    loadScript().then(loaded => {
      setScriptLoaded(loaded);
    });
  }, [showWidget, loadScript]);

  // Initialize webchat once script is loaded
  useEffect(() => {
    if (scriptLoaded && showWidget) {
      initializeBot().then(success => {
        if (success) {
          setupMessageListener();
        }
      });
    }
    
    return cleanup;
  }, [scriptLoaded, showWidget, initializeBot, setupMessageListener, cleanup]);

  return {
    minimized,
    unreadCount,
    initialized,
    toggleChat,
    sendMessage,
    askMovieQuestion
  };
};

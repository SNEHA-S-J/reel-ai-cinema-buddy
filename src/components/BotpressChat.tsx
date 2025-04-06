
import { useEffect, useState } from "react";

interface BotpressWindow extends Window {
  botpressWebChat?: {
    init: (config: any) => void;
    sendEvent: (event: any) => void;
  };
}

declare const window: BotpressWindow;

const BotpressChat = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
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
  }, []);

  // Initialize webchat once script is loaded
  useEffect(() => {
    if (scriptLoaded && window.botpressWebChat) {
      try {
        console.log("Initializing Botpress webchat");
        window.botpressWebChat.init({
          composerPlaceholder: "Chat with Reel-AI",
          botConversationDescription: "Movie recommendation assistant",
          botId: "NT36MHXW",
          hostUrl: "https://cdn.botpress.cloud/webchat/v2.3",
          messagingUrl: "https://messaging.botpress.cloud",
          clientId: "NT36MHXW",
          botName: "Reel-AI Assistant",
          useSessionStorage: true,
          stylesheet: "https://files.bpcontent.cloud/2025/04/06/16/20250406164749-NT36MHXW.json",
          enableConversationDeletion: true,
          hideWidget: false,
          disableAnimations: false,
          closeOnEscape: false,
          showPoweredBy: false,
          className: "botpress-webchat",
          containerWidth: "100%",
          layoutWidth: "100%",
        });
      } catch (error) {
        console.error("Error initializing Botpress webchat:", error);
      }
    }
  }, [scriptLoaded]);

  return null;
};

export default BotpressChat;


import { useEffect } from "react";

const BotpressChat = () => {
  useEffect(() => {
    // Load the Botpress webchat script
    const script = document.createElement('script');
    script.src = "https://cdn.botpress.cloud/webchat/v2.3/inject.js";
    script.async = true;
    document.body.appendChild(script);

    // Configure and initialize the webchat once the script is loaded
    script.onload = () => {
      // @ts-ignore - Botpress adds window.botpressWebChat
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
    };

    // Cleanup function to remove the script when component unmounts
    return () => {
      // @ts-ignore - Botpress adds window.botpressWebChat
      if (window.botpressWebChat) {
        // @ts-ignore
        window.botpressWebChat.sendEvent({ type: "hide" });
      }
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default BotpressChat;


import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { BotpressScriptConfig } from "./types";

// Handles bot initialization and configuration
export const useBotInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  const botInitialized = useRef(false);
  const initializationTimeout = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const initializeBot = () => {
    if (botInitialized.current) return Promise.resolve(true);
    
    return new Promise<boolean>((resolve) => {
      try {
        console.log("Initializing Botpress webchat");
        
        // Add a small delay to ensure the script is fully loaded
        initializationTimeout.current = setTimeout(() => {
          if (window.botpressWebChat) {
            // Configure and initialize the bot using the shareable URL configuration
            const config: BotpressScriptConfig = {
              configUrl: "https://files.bpcontent.cloud/2025/04/06/16/20250406164749-NT36MHXW.json",
              hideWidget: true,  // We'll control widget visibility ourselves
              stylesheet: 'body .bp-widget-web { z-index: 999; }' // Ensure proper z-index
            };
            
            window.botpressWebChat.init(config);
            
            console.log("Botpress initialization complete");
            botInitialized.current = true;
            setInitialized(true);
            resolve(true);
          } else {
            console.error("botpressWebChat is not available after script load");
            toast({
              title: "AI Assistant Error",
              description: "Could not initialize the chat. Please refresh the page.",
              variant: "destructive"
            });
            resolve(false);
          }
        }, 1000); // Give it a second to ensure the script is ready
      } catch (error) {
        console.error("Error initializing Botpress webchat:", error);
        toast({
          title: "AI Assistant Error",
          description: "There was an error initializing the AI assistant.",
          variant: "destructive"
        });
        resolve(false);
      }
    });
  };

  const cleanup = () => {
    if (initializationTimeout.current) {
      clearTimeout(initializationTimeout.current);
    }
  };

  return { 
    initialized, 
    botInitialized: botInitialized.current, 
    initializeBot, 
    cleanup 
  };
};

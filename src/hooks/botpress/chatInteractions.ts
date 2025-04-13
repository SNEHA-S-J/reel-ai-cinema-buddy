
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BotpressMessageEvent } from "./types";

// Manages interactions with the Botpress chat
export const useChatInteractions = (initialized: boolean) => {
  const [minimized, setMinimized] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  const setupMessageListener = () => {
    if (window.botpressWebChat) {
      window.botpressWebChat.onEvent('message', (payload) => {
        console.log("Botpress message received:", payload);
        if (minimized && payload.direction === 'incoming') {
          setUnreadCount(prev => prev + 1);
          toast({
            title: "New message from Chat Bot",
            description: payload.payload?.text?.substring(0, 60) + (payload.payload?.text?.length > 60 ? "..." : ""),
            duration: 5000,
          });
        }
      });
    }
  };

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
          title: "Chat Bot Error",
          description: "There was an error with the chat. Please refresh the page.",
          variant: "destructive"
        });
      }
    } else {
      console.warn("Botpress not initialized yet");
      toast({
        title: "Chat Bot Loading",
        description: "Please wait while the chat bot initializes...",
      });
    }
  };

  const sendMessage = (message: string) => {
    if (window.botpressWebChat && initialized) {
      try {
        console.log("Sending message to Botpress:", message);
        // First show the chat
        window.botpressWebChat.sendEvent({
          type: 'show'
        });
        setMinimized(false);
        
        // Then send the message after a short delay to ensure UI is ready
        setTimeout(() => {
          if (window.botpressWebChat) {
            const event: BotpressMessageEvent = {
              type: 'message',
              payload: {
                type: 'text',
                text: message
              }
            };
            window.botpressWebChat.sendEvent(event);
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
        title: "Chat Bot Loading",
        description: "Please wait while the chat bot initializes...",
      });
    }
  };

  const askMovieQuestion = (movieTitle: string) => {
    if (window.botpressWebChat && initialized) {
      try {
        const message = `Tell me about the movie "${movieTitle}"`;
        console.log("Asking movie question:", message);
        
        // Show the chat and send the question
        window.botpressWebChat.sendEvent({
          type: 'show'
        });
        setMinimized(false);
        
        setTimeout(() => {
          if (window.botpressWebChat) {
            const event: BotpressMessageEvent = {
              type: 'message',
              payload: {
                type: 'text',
                text: message
              }
            };
            window.botpressWebChat.sendEvent(event);
          }
        }, 300);
      } catch (error) {
        console.error("Error asking movie question:", error);
        toast({
          title: "Message Error",
          description: "Could not send your movie question. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      console.warn("Cannot ask movie question: Botpress not initialized");
      toast({
        title: "Chat Bot Loading",
        description: "Please wait while the chat bot initializes...",
      });
    }
  };

  return {
    minimized,
    unreadCount,
    setupMessageListener,
    toggleChat,
    sendMessage,
    askMovieQuestion
  };
};

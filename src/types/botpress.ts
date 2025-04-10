
// Define the BotpressWebChat interface
export interface BotpressWebChat {
  init: (config: any) => void;
  onEvent: (event: string, handler: (payload: any) => void) => void;
  sendEvent: (event: any) => void;
}

// Extend the Window interface to include botpressWebChat
declare global {
  interface Window {
    botpressWebChat: BotpressWebChat;
  }
}

export interface BotpressChatProps {
  showWidget?: boolean;
}

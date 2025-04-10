
// Defining the interface for Botpress WebChat
export interface BotpressWebChat {
  init: (config: any) => void;
  sendEvent: (event: any) => void;
  onEvent: (event: string, handler: (payload: any) => void) => void;
}

// Extending the Window interface
declare global {
  interface Window {
    botpressWebChat?: BotpressWebChat;
  }
}

export interface BotpressChatProps {
  showWidget?: boolean;
}

export interface ConversationStarter {
  id: number;
  text: string;
}

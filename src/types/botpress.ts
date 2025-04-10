
export interface BotpressWindow extends Window {
  botpressWebChat?: {
    init: (config: any) => void;
    sendEvent: (event: any) => void;
    onEvent: (event: string, handler: (payload: any) => void) => void;
  };
}

declare global {
  interface Window extends BotpressWindow {}
}

export interface BotpressChatProps {
  showWidget?: boolean;
}

export interface ConversationStarter {
  id: number;
  text: string;
}

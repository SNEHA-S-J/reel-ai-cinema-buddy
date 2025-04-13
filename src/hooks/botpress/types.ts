
// Types related to Botpress integration
export interface BotpressScriptConfig {
  configUrl: string;
  hideWidget: boolean;
  stylesheet?: string;
}

export interface BotpressMessageEvent {
  type: string;
  payload: {
    type: string;
    text: string;
  };
}

export interface BotpressShowHideEvent {
  type: 'show' | 'hide';
}

export interface BotpressMessage {
  direction: string;
  payload?: {
    text?: string;
  };
}

export interface UseBotpressResult {
  minimized: boolean;
  unreadCount: number;
  initialized: boolean;
  toggleChat: () => void;
  sendMessage: (message: string) => void;
  askMovieQuestion: (movieTitle: string) => void;
}

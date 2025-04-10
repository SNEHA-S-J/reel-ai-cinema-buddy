
import React from 'react';

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface SimpleBotMessageProps {
  message: Message;
}

const SimpleBotMessage: React.FC<SimpleBotMessageProps> = ({ message }) => {
  const isBot = message.isBot;

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-sm ${
          isBot 
            ? 'bg-retro-yellow text-retro-gray border-retro-red border' 
            : 'bg-retro-gray text-retro-white'
        }`}
      >
        <p className="text-sm font-mono">{message.text}</p>
        <span className="text-xs opacity-70 block mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default SimpleBotMessage;

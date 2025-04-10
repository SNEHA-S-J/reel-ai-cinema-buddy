
import React, { useRef, useEffect } from 'react';
import { useSimpleBot } from '@/hooks/useSimpleBot';
import SimpleBotButton from './SimpleBotButton';
import SimpleBotMessage from './SimpleBotMessage';
import { Send, Bot } from 'lucide-react';

interface SimpleBotProps {
  showWidget?: boolean;
}

const SimpleBot = ({ showWidget = true }: SimpleBotProps) => {
  const {
    isOpen,
    toggleChat,
    messages,
    inputText,
    unreadCount,
    handleInputChange,
    handleSubmit,
    sendMessage
  } = useSimpleBot();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!showWidget) return null;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 left-6 z-50">
        <SimpleBotButton
          isOpen={isOpen}
          unreadCount={unreadCount}
          onClick={toggleChat}
        />
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 h-96 bg-retro-white border-2 border-retro-red rounded-sm shadow-lg flex flex-col">
          {/* Header */}
          <div className="bg-retro-yellow border-b-2 border-retro-red p-3 font-mono font-bold text-retro-gray">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <span>SimpleBot</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((message) => (
              <SimpleBotMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t-2 border-retro-red p-2 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask SimpleBot..."
              className="flex-1 p-2 border-2 border-retro-gray focus:border-retro-red font-mono text-sm outline-none rounded-sm"
            />
            <button
              type="submit"
              className="bg-retro-yellow hover:bg-retro-yellow/80 text-retro-gray p-2 rounded-sm border-2 border-retro-red"
              disabled={!inputText.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default SimpleBot;


import { useState, useCallback } from 'react';
import { Message } from '@/components/SimpleBot/SimpleBotMessage';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: "Hello! I'm SimpleBot, your movie assistant. How can I help you today?",
    isBot: true,
    timestamp: new Date()
  }
];

// Simple responses to common questions
const BOT_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello there! How can I help with movies today?",
    "Hi! Looking for a movie recommendation?"
  ],
  recommendation: [
    "Based on popular choices, I'd recommend watching 'Everything Everywhere All at Once' or 'Dune'.",
    "You might enjoy 'The Shawshank Redemption' - it's a classic!",
    "How about 'Parasite'? It won Best Picture and is highly rated."
  ],
  genre: [
    "Some popular genres include Action, Comedy, Drama, Horror, and Sci-Fi. Which one interests you?",
    "I can help with recommendations in any genre. Action, Romance, Thriller - just let me know!"
  ],
  thanks: [
    "You're welcome! Enjoy your movie!",
    "My pleasure! Let me know if you need more recommendations."
  ],
  default: [
    "I'm a simple bot, so I might not understand everything. Try asking about movie recommendations or genres.",
    "Sorry, I didn't catch that. Could you ask about movie genres or recommendations?",
    "I'm still learning! Try asking me for movie recommendations or about popular genres."
  ]
};

export const useSimpleBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const { toast } = useToast();

  // Simple bot logic to determine response
  const getBotResponse = (text: string): string => {
    text = text.toLowerCase();
    
    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      return BOT_RESPONSES.greeting[Math.floor(Math.random() * BOT_RESPONSES.greeting.length)];
    } else if (text.includes('recommend') || text.includes('suggest') || text.includes('watch')) {
      return BOT_RESPONSES.recommendation[Math.floor(Math.random() * BOT_RESPONSES.recommendation.length)];
    } else if (text.includes('genre') || text.includes('type') || text.includes('category')) {
      return BOT_RESPONSES.genre[Math.floor(Math.random() * BOT_RESPONSES.genre.length)];
    } else if (text.includes('thank')) {
      return BOT_RESPONSES.thanks[Math.floor(Math.random() * BOT_RESPONSES.thanks.length)];
    } else {
      return BOT_RESPONSES.default[Math.floor(Math.random() * BOT_RESPONSES.default.length)];
    }
  };

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    
    // Simulate bot thinking
    setTimeout(() => {
      const botResponse: Message = {
        id: uuidv4(),
        text: getBotResponse(text),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
        toast({
          title: "New message from SimpleBot",
          description: botResponse.text.substring(0, 60) + (botResponse.text.length > 60 ? "..." : ""),
          duration: 5000,
        });
      }
    }, 1000);
  }, [isOpen, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText.trim());
    }
  };

  return {
    isOpen,
    toggleChat,
    messages,
    inputText,
    unreadCount,
    handleInputChange,
    handleSubmit,
    sendMessage
  };
};

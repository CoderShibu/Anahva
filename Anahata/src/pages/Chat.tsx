import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfidentialMode } from '@/contexts/ConfidentialModeContext';
import { useNightWatch } from '@/contexts/NightWatchContext';
import { useStressMode } from '@/contexts/StressModeContext';
import { detectIndianContext } from '@/utils/regionalContext';
import Navigation from '@/components/Navigation';
import { Send, Mic, Heart, Moon } from 'lucide-react';
import { chatAPI, chatHistoryAPI } from '@/lib/api';

interface Message {
  id: number;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

const Chat = () => {
  const { t } = useLanguage();
  const { isConfidential } = useConfidentialMode();
  const { isNightMode } = useNightWatch();
  const { stressMode } = useStressMode();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: isNightMode
        ? "It's late, and nights can feel heavier. I'm here to listen, no judgment. What's on your heart?"
        : t('aiGreeting'),
      isAI: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);

    // Save user message if not confidential
    if (!isConfidential) {
      chatHistoryAPI.saveMessage(userMessage);
    }

    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Try backend API first
      const mode = stressMode ? 'CALM' : isNightMode ? 'LISTEN' : 'REFLECT';
      const response = await chatAPI.sendMessage(userInput, mode, !isConfidential);

      const aiMessage: Message = {
        id: messages.length + 2,
        text: response.response || response.message || 'I understand. How are you feeling?',
        isAI: true,
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);

      // Save AI message if not confidential
      if (!isConfidential) {
        chatHistoryAPI.saveMessage(aiMessage);
      }
    } catch (error: any) {
      console.error('Chat API error:', error);

      const errorMessage = error.message || "I'm having trouble connecting to the AI server. Please check the backend logs.";

      const aiMessage: Message = {
        id: messages.length + 2,
        text: `[Error] ${errorMessage}`,
        isAI: true,
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-64 flex flex-col">
      <Navigation />

      <motion.div
        className="px-6 py-4 border-b border-border bg-charcoal-deep/50 backdrop-blur-lg md:ml-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl text-foreground">Anahva</h1>
              <p className="text-xs text-muted-foreground">{t('yourSanctuary')}</p>
            </div>
          </div>
          {isNightMode && (
            <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
              <Moon className="w-3 h-3" />
              <span>Night-Watch Mode: Gentle listening</span>
            </div>
          )}
          {isConfidential && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full w-fit mt-2">
              <span>Confidential Mode: No memory stored</span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] ${message.isAI ? 'chat-bubble-ai' : 'chat-bubble bg-primary/20'
                    }`}
                >
                  <p className="text-foreground leading-relaxed">{message.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="chat-bubble-ai flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary/60"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    {t('anahataTyping')}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      <motion.div
        className="px-6 py-4 border-t border-border bg-charcoal-deep/50 backdrop-blur-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <motion.button
            className="p-3 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-5 h-5" />
          </motion.button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('typeMessage')}
            className="flex-1 input-sanctuary"
          />

          <motion.button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-3 rounded-xl transition-all ${input.trim()
                ? 'bg-primary text-primary-foreground glow-gold'
                : 'bg-secondary text-muted-foreground'
              }`}
            whileHover={input.trim() ? { scale: 1.05 } : {}}
            whileTap={input.trim() ? { scale: 0.95 } : {}}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;

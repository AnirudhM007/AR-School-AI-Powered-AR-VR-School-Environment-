'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Bot, User } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedTopics?: string[];
}

interface ChatUIProps {
  topic?: string;
}

const MOCK_RESPONSES: Record<string, { answer: string; relatedTopics: string[] }> = {
  default: {
    answer: "Great question! I'm here to help you learn. Could you be more specific about what you'd like to know?",
    relatedTopics: ['Biology', 'Science'],
  },
  heart: {
    answer: "The human heart is a muscular organ that pumps blood throughout the body, delivering oxygen and nutrients to tissues and removing waste. It has four chambers: two atria and two ventricles. The heart works continuously to keep us alive — beating about 100,000 times per day!",
    relatedTopics: ['Circulatory System', 'Blood', 'Veins & Arteries'],
  },
  solar: {
    answer: "The Solar System consists of the Sun and everything bound to it by gravity — 8 planets, dwarf planets, moons, asteroids, and comets. The Sun contains 99.86% of all mass in the Solar System. The planets orbit in an elliptical path due to gravitational forces.",
    relatedTopics: ['Planets', 'Gravity', 'Space'],
  },
};

function getMockResponse(question: string, topic?: string): typeof MOCK_RESPONSES['default'] {
  const q = question.toLowerCase();
  if (q.includes('heart') || topic?.toLowerCase().includes('heart')) return MOCK_RESPONSES.heart;
  if (q.includes('solar') || q.includes('planet') || topic?.toLowerCase().includes('solar')) return MOCK_RESPONSES.solar;
  return MOCK_RESPONSES.default;
}

export default function ChatUI({ topic }: ChatUIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hi! I'm your AR School AI assistant${topic ? ` for **${topic}**` : ''}. What would you like to learn today? 🎓`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Try real API first, fall back to mock
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, topic }),
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.answer,
          timestamp: new Date(),
          relatedTopics: data.relatedTopics,
        },
      ]);
    } catch {
      const mock = getMockResponse(question, topic);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: mock.answer,
            timestamp: new Date(),
            relatedTopics: mock.relatedTopics,
          },
        ]);
        setLoading(false);
      }, 1200);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full pb-20">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-brand-purple to-brand-indigo'
                    : 'glass-purple'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <Bot size={16} className="text-white" />
                ) : (
                  <User size={16} className="text-brand-accent" />
                )}
              </div>

              {/* Bubble */}
              <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-brand-purple to-brand-indigo text-white rounded-tr-sm'
                      : 'glass text-white/90 rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Related topics chips */}
                {msg.relatedTopics && msg.relatedTopics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs text-white/40">Related:</span>
                    {msg.relatedTopics.map(t => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 glass-purple rounded-full text-brand-accent"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-indigo flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="glass px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-brand-accent"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div className="px-4 pb-4 pt-2">
        <div className="glass-strong rounded-2xl flex items-center gap-2 px-4 py-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your question..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none py-1"
          />
          <motion.button
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-purple to-brand-indigo flex items-center justify-center"
            whileTap={{ scale: 0.85 }}
            onClick={sendMessage}
            disabled={loading}
          >
            <Send size={14} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

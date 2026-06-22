'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { useAppState } from '@/lib/app-state';
import { iosGentleSpring, iosSnappySpring } from '@/lib/motion';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedTopics?: string[];
}

interface ChatUIProps {
  topic?: string;
  topicId?: string;
  selectedLabel?: string | null;
  initialPrompt?: string | null;
  quickQuestions?: string[];
}

const MOCK_RESPONSES: Record<string, { answer: string; relatedTopics: string[] }> = {
  default: {
    answer:
      "Great question. I can explain the model you're viewing, connect it to class concepts, and point you to the next idea to explore.",
    relatedTopics: ['Science', 'Observation', 'Revision'],
  },
  heart: {
    answer:
      'The human heart pumps blood through the body using four chambers. The atria receive blood, while the ventricles pump it out. This keeps oxygen and nutrients moving to tissues continuously.',
    relatedTopics: ['Circulatory System', 'Blood Flow', 'Arteries'],
  },
  solar: {
    answer:
      'The Solar System is centered around the Sun. Gravity keeps planets in orbit, and the planets differ in size, composition, and distance from the Sun.',
    relatedTopics: ['Planets', 'Gravity', 'Orbits'],
  },
};

function getMockResponse(question: string, topic?: string) {
  const input = `${question} ${topic ?? ''}`.toLowerCase();
  if (input.includes('heart') || input.includes('aorta')) return MOCK_RESPONSES.heart;
  if (input.includes('solar') || input.includes('planet') || input.includes('sun')) return MOCK_RESPONSES.solar;
  return MOCK_RESPONSES.default;
}

export default function ChatUI({
  topic,
  topicId,
  selectedLabel,
  initialPrompt,
  quickQuestions = [],
}: ChatUIProps) {
  const { markAIQuestion } = useAppState();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: selectedLabel
        ? `You are studying ${topic}. I can focus on ${selectedLabel} or answer broader questions about the model.`
        : `You are exploring ${topic ?? 'AR School'}. Ask me anything and I will explain it in a student-friendly way.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState(initialPrompt ?? '');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (preset?: string) => {
    const question = (preset ?? input).trim();
    if (!question || loading) return;

    if (!preset) {
      setInput('');
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          topic,
          topicId,
          selectedLabel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch explanation');
      }

      const data = await response.json();
      markAIQuestion(topicId);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: data.answer,
          timestamp: new Date(),
          relatedTopics: data.relatedTopics,
        },
      ]);
    } catch {
      const mock = getMockResponse(question, topic);
      markAIQuestion(topicId);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: mock.answer,
          timestamp: new Date(),
          relatedTopics: mock.relatedTopics,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-3">
        <div className="glass-strong flex items-center gap-3 rounded-[24px] px-4 py-3">
          <div className="glass-purple grid h-11 w-11 place-items-center rounded-[18px]">
            <Sparkles size={18} className="text-brand-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{topic ?? 'AI Assistant'}</p>
            <p className="text-xs text-white/45">
              {selectedLabel ? `Focused on ${selectedLabel}` : 'Context-aware help while you learn'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={iosGentleSpring}
              className={`mb-4 flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`grid h-9 w-9 place-items-center rounded-full ${
                  message.role === 'assistant' ? 'glass-purple' : 'glass'
                }`}
              >
                {message.role === 'assistant' ? (
                  <Bot size={16} className="text-white" />
                ) : (
                  <User size={16} className="text-brand-accent" />
                )}
              </div>

              <div className={`flex max-w-[82%] flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-[24px] px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-gradient-primary text-white shadow-glow-sm'
                      : 'glass text-white/90'
                  }`}
                >
                  {message.content}
                </div>
                {message.relatedTopics?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {message.relatedTopics.map((entry) => (
                      <span key={entry} className="glass-outline rounded-full px-2.5 py-1 text-[11px] font-semibold text-white/70">
                        {entry}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          ))}

          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 flex gap-3"
            >
              <div className="glass-purple grid h-9 w-9 place-items-center rounded-full">
                <Bot size={16} className="text-white" />
              </div>
              <div className="glass flex items-center gap-1 rounded-[24px] px-4 py-3">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className="h-2 w-2 rounded-full bg-brand-accent"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 1.15, repeat: Infinity, delay: dot * 0.16 }}
                  />
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {messages.length === 1 && quickQuestions.length > 0 ? (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Suggested Questions</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.slice(0, 3).map((question) => (
                <button
                  key={question}
                  onClick={() => sendMessage(question)}
                  className="glass rounded-full px-3 py-2 text-left text-xs font-semibold text-white/75"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>

      <div className="px-5 pb-5 pt-2">
        <div className="glass-strong flex items-center gap-2 rounded-[26px] px-3 py-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                sendMessage();
              }
            }}
            placeholder={selectedLabel ? `Ask about ${selectedLabel}...` : 'Type your question...'}
            className="flex-1 bg-transparent px-2 text-sm text-white placeholder:text-white/30 outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={iosSnappySpring}
            onClick={() => sendMessage()}
            disabled={loading}
            className="grid h-11 w-11 place-items-center rounded-[18px] bg-gradient-primary text-white shadow-glow-sm disabled:opacity-60"
          >
            <Send size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

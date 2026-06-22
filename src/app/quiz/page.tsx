'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, Sparkles } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { getQuizTopics, useAppState } from '@/lib/app-state';
import { QUIZZES } from '@/lib/gamification';

export default function QuizHubPage() {
  const { topicProgress } = useAppState();
  const quizTopics = getQuizTopics();

  return (
    <main className="page-shell px-5 pt-10">
      <motion.section initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="screen-kicker">Quiz Center</p>
        <h1 className="screen-title">Challenge your understanding</h1>
        <p className="screen-subtitle mt-3 max-w-lg">
          Review the lessons you explored, then lock your learning in with quick mastery quizzes.
        </p>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-5">
        <GlassCard variant="purple" className="p-5" glow>
          <div className="flex items-center gap-4">
            <div className="glass grid h-14 w-14 place-items-center rounded-[22px]">
              <Brain size={22} className="text-brand-accent" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">Adaptive progress-ready quizzes</p>
              <p className="mt-1 text-sm leading-6 text-white/65">
                Your best score, XP reward, and topic mastery are saved locally on this device.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <div className="space-y-3">
        {quizTopics.map((topic, index) => {
          const quiz = QUIZZES[topic.id];
          const progress = topicProgress[topic.id];
          const bestScore = progress?.quizBestTotal
            ? `${progress.quizBestScore}/${progress.quizBestTotal}`
            : 'Not attempted';

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + index * 0.05, type: 'spring', stiffness: 220, damping: 24 }}
            >
              <Link href={`/quiz/${topic.id}`}>
                <GlassCard className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`grid h-14 w-14 place-items-center rounded-[22px] bg-gradient-to-br ${topic.color} text-3xl shadow-glow-sm`}>
                      {topic.thumbnail}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-white">{quiz.title}</h2>
                        <Sparkles size={14} className="text-brand-cyan" />
                      </div>
                      <p className="mt-1 text-sm text-white/52">
                        {quiz.questions.length} questions, up to {quiz.rewardXP} XP
                      </p>
                      <p className="mt-1 text-xs text-white/38">Best score: {bestScore}</p>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}

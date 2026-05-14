'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle2, Zap } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { QUIZZES } from '@/lib/gamification';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params?.topicId as string;
  const quiz = QUIZZES[topicId];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  if (!quiz) {
    return (
      <main className="page-shell flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50">No quiz available for this topic yet.</p>
          <button onClick={() => router.back()} className="text-brand-accent mt-4">Go Back</button>
        </div>
      </main>
    );
  }

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // Prevent double click
    setSelectedAnswer(index);

    const isCorrect = index === question.correctAnswerIndex;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(c => c + 1);
        setSelectedAnswer(null);
      }
    }, 1000);
  };

  return (
    <main className="page-shell px-5 pt-12 pb-24 flex flex-col h-dvh">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="w-10 h-10 glass rounded-2xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white/70" />
        </button>
        <h1 className="text-white font-bold text-sm tracking-wide">{quiz.title}</h1>
        <div className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-brand-accent font-bold text-sm">
          {currentQuestion + 1}/{quiz.questions.length}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {/* ── Progress Bar ── */}
            <div className="h-1.5 w-full glass rounded-full overflow-hidden mb-6">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-purple to-brand-indigo"
                initial={{ width: `${(currentQuestion / quiz.questions.length) * 100}%` }}
                animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>

            {/* ── Question ── */}
            <h2 className="text-white text-2xl font-bold leading-tight mb-8">
              {question.question}
            </h2>

            {/* ── Options ── */}
            <div className="space-y-3 mt-auto">
              {question.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === question.correctAnswerIndex;
                
                let stateClass = "glass hover:bg-white/5";
                if (selectedAnswer !== null) {
                  if (isCorrect) stateClass = "bg-green-500/20 border-green-500/50 text-green-100";
                  else if (isSelected && !isCorrect) stateClass = "bg-red-500/20 border-red-500/50 text-red-100";
                  else stateClass = "glass opacity-50"; // Dim unselected
                }

                return (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-4 rounded-2xl text-left font-medium transition-all ${stateClass} border border-transparent`}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-purple to-brand-indigo flex items-center justify-center shadow-glow-purple mb-6">
              <span className="text-4xl">{score === quiz.questions.length ? '🏆' : '👍'}</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
            <p className="text-white/60 mb-8">You scored {score} out of {quiz.questions.length}.</p>

            <GlassCard variant="purple" className="w-full p-5 flex justify-between items-center mb-8" hover={false} tap={false}>
              <div className="text-left">
                <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-1">XP Earned</p>
                <p className="text-brand-accent text-2xl font-bold flex items-center gap-2">
                  +{Math.round((score / quiz.questions.length) * quiz.rewardXP)} <Zap size={20} className="fill-brand-accent" />
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-1">Accuracy</p>
                <p className="text-white text-2xl font-bold">{Math.round((score / quiz.questions.length) * 100)}%</p>
              </div>
            </GlassCard>

            <button
              onClick={() => router.back()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold shadow-glow-sm"
            >
              Continue Learning
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

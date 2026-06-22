'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Award,
  ArrowRight,
  Brain,
  Menu,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import AppMenuSheet from '@/components/AppMenuSheet';
import AuthModal from '@/components/AuthModal';
import SearchBar from '@/components/SearchBar';
import GlassCard from '@/components/GlassCard';
import InstallAppButton from '@/components/InstallAppButton';
import { getQuizTopics, useAppState } from '@/lib/app-state';
import { iosFadeDown, iosFadeUp, iosGentleSpring } from '@/lib/motion';
import { CLASSES, TOPICS } from '@/lib/topics';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: iosGentleSpring,
  },
};

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { badges, isHydrated, profile, quests, recentTopics, signIn, stats, topicProgress } =
    useAppState();

  const filteredClasses = CLASSES.filter((item) =>
    query === '' ? true : item.label.toLowerCase().includes(query.toLowerCase()),
  );
  const featuredTopic = TOPICS[0];
  const spotlightTopics = TOPICS.slice(1, 4);
  const quizTopics = getQuizTopics();
  const completedBadges = badges.filter((badge) => badge.unlocked);
  const nextQuest = quests.find((quest) => !quest.completed) ?? quests[0];
  const continueTopic = recentTopics[0] ?? featuredTopic;
  const favoriteCount = useMemo(
    () => Object.values(topicProgress).filter((entry) => entry.favorite).length,
    [topicProgress],
  );

  if (!isHydrated) {
    return (
      <main className="page-shell px-5 pt-10">
        <div className="screen-header mb-6">
          <div>
            <p className="screen-kicker">AR School</p>
            <h1 className="screen-title text-gradient">Loading your dashboard...</h1>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <GlassCard
              key={index}
              variant="strong"
              className="h-28 p-4"
              tap={false}
              hover={false}
            >
              <div className="h-full rounded-[20px] bg-white/5" />
            </GlassCard>
          ))}
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="page-shell px-5 pt-8">
        <motion.section
          initial={iosFadeDown.initial}
          animate={iosFadeDown.animate}
          transition={iosFadeDown.transition}
          className="screen-header mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              aria-label="Open app menu"
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowMenu(true)}
              className="glass h-11 w-11 rounded-[20px] grid place-items-center"
            >
              <Menu size={18} className="text-white/80" />
            </motion.button>
            <div>
              <p className="screen-kicker">AR School</p>
              <h1 className="text-xl font-semibold text-white">
                {profile.isSignedIn ? `Welcome back, ${profile.name.split(' ')[0]}` : 'Learn in 3D'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <InstallAppButton />
            <button
              type="button"
              aria-label={
                profile.isSignedIn ? 'Open profile and menu' : 'Create local student profile'
              }
              onClick={() => (profile.isSignedIn ? setShowMenu(true) : setShowAuth(true))}
              className="glass-purple flex h-11 min-w-11 items-center justify-center rounded-[20px] px-3 text-sm font-semibold text-white/85"
            >
              {profile.avatar}
            </button>
          </div>
        </motion.section>

        <motion.section
          initial={iosFadeUp.initial}
          animate={iosFadeUp.animate}
          transition={{ ...iosFadeUp.transition, delay: 0.06 }}
          className="mb-6"
        >
          <GlassCard variant="purple" className="overflow-hidden p-5 sm:p-6" glow>
            <div className="absolute inset-0 bg-gradient-mesh opacity-80" />
            <div className="absolute -right-10 top-6 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-8 h-24 w-24 rounded-full bg-brand-cyan/10 blur-3xl" />

            <div className="relative">
              <div className="mb-4 flex flex-wrap gap-2">
                {['WebXR lessons', 'AI tutor', 'Installable PWA'].map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-white/80"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
                <div>
                  <h2 className="max-w-xl text-[2rem] font-semibold leading-[1.02] text-white sm:text-[2.6rem]">
                    Learn science in your room, not just on a page.
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                    Open realistic 3D models, place them in augmented reality, ask the built-in
                    tutor questions, and track progress across quizzes, badges, and daily quests.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={{ pathname: `/viewer/${featuredTopic.id}`, query: { from: '/' } }}
                      className="rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow-sm"
                    >
                      Start Demo Lesson
                    </Link>
                    <Link
                      href="/library"
                      className="glass-fast rounded-full px-5 py-3 text-sm font-semibold text-white/85"
                    >
                      Explore Library
                    </Link>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="glass-fast rounded-[22px] p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/42">
                        Progress
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">{profile.xp}</p>
                      <p className="text-xs text-white/52">XP saved locally</p>
                    </div>
                    <div className="glass-fast rounded-[22px] p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/42">
                        Lessons
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {stats.topicsExplored}
                      </p>
                      <p className="text-xs text-white/52">Topics explored</p>
                    </div>
                    <div className="glass-fast rounded-[22px] p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/42">
                        Quizzes
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {stats.quizzesCompleted}
                      </p>
                      <p className="text-xs text-white/52">Attempts completed</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 self-end">
                  <GlassCard variant="strong" className="p-4" tap={false}>
                    <p className="screen-kicker">Immersive AR</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      Place models directly on desks and tables
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      Designed for phone-first lessons with interactive controls and contextual
                      labels.
                    </p>
                  </GlassCard>
                  <div className="grid grid-cols-2 gap-3">
                    <GlassCard className="p-4" tap={false}>
                      <Brain size={18} className="text-brand-cyan" />
                      <p className="mt-3 text-sm font-semibold text-white">Ask AI</p>
                      <p className="mt-1 text-xs leading-5 text-white/55">
                        Explain structures while viewing the model.
                      </p>
                    </GlassCard>
                    <GlassCard className="p-4" tap={false}>
                      <Trophy size={18} className="text-brand-accent" />
                      <p className="mt-3 text-sm font-semibold text-white">Earn XP</p>
                      <p className="mt-1 text-xs leading-5 text-white/55">
                        Quizzes, streaks, badges, and progress tracking.
                      </p>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        <motion.div
          initial={iosFadeUp.initial}
          animate={iosFadeUp.animate}
          transition={{ ...iosFadeUp.transition, delay: 0.1 }}
          className="mb-5"
        >
          <SearchBar
            placeholder="Search classes, topics, or concepts..."
            onSearch={setQuery}
            className="w-full"
          />
        </motion.div>

        <motion.section
          initial={iosFadeUp.initial}
          animate={iosFadeUp.animate}
          transition={{ ...iosFadeUp.transition, delay: 0.14 }}
          className="mb-6 grid gap-3 sm:grid-cols-3"
        >
          <GlassCard variant="strong" className="p-4">
            <p className="screen-kicker">Your Level</p>
            <p className="mt-2 text-2xl font-semibold text-white">Level {profile.level}</p>
            <p className="mt-1 text-sm text-white/55">
              {profile.xp} XP with {completedBadges.length} badges unlocked.
            </p>
          </GlassCard>
          <GlassCard variant="strong" className="p-4">
            <p className="screen-kicker">Daily Quest</p>
            <p className="mt-2 text-base font-semibold text-white">{nextQuest.title}</p>
            <p className="mt-1 text-sm text-white/55">
              {nextQuest.progress}/{nextQuest.total} complete for +{nextQuest.rewardXP} XP
            </p>
          </GlassCard>
          <GlassCard variant="strong" className="p-4">
            <p className="screen-kicker">Saved Revision</p>
            <p className="mt-2 text-2xl font-semibold text-white">{favoriteCount}</p>
            <p className="mt-1 text-sm text-white/55">
              Favorites ready for quick revision sessions.
            </p>
          </GlassCard>
        </motion.section>

        <motion.section
          initial={iosFadeUp.initial}
          animate={iosFadeUp.animate}
          transition={{ ...iosFadeUp.transition, delay: 0.18 }}
          className="mb-6 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <Link
            href={{
              pathname: `/viewer/${continueTopic.id}`,
              query: { from: '/' },
            }}
          >
            <GlassCard variant="purple" className="h-full overflow-hidden p-5" glow>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/10 to-transparent" />
              <div className="relative flex h-full items-start justify-between gap-4">
                <div className="max-w-[70%]">
                  <p className="screen-kicker text-white/70">Continue Learning</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{continueTopic.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/70">
                    Jump back into your strongest topic flow and move from model view to AR, quiz,
                    and AI explanation without losing progress.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    Re-open lesson <ArrowRight size={15} />
                  </span>
                </div>
                <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/12 bg-white/10 text-6xl shadow-glow-sm">
                  {continueTopic.thumbnail}
                </div>
              </div>
            </GlassCard>
          </Link>

          <div className="grid gap-3">
            <Link href="/quiz">
              <GlassCard className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="screen-kicker">Quiz Center</p>
                    <h2 className="mt-2 text-lg font-semibold text-white">
                      Test what you learned
                    </h2>
                    <p className="mt-1 text-sm text-white/55">
                      {quizTopics.length} topic quizzes ready right now.
                    </p>
                  </div>
                  <Brain size={24} className="text-brand-cyan" />
                </div>
              </GlassCard>
            </Link>
            <Link href="/achievements">
              <GlassCard className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="screen-kicker">Achievement Vault</p>
                    <h2 className="mt-2 text-lg font-semibold text-white">
                      Show your milestones
                    </h2>
                    <p className="mt-1 text-sm text-white/55">
                      {completedBadges
                        .slice(0, 3)
                        .map((badge) => badge.title)
                        .join(', ') || 'Start learning to unlock your first badge.'}
                    </p>
                  </div>
                  <Award size={24} className="text-brand-accent" />
                </div>
              </GlassCard>
            </Link>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...iosFadeUp.transition, delay: 0.22 }}
          className="mb-7"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Explore by Class</h2>
              <p className="text-sm text-white/45">Choose a grade to open curated topics.</p>
            </div>
            <Link href="/library" className="text-sm font-semibold text-brand-accent">
              See all
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {filteredClasses.map((cls) => (
              <motion.div key={cls.id} variants={itemVariants}>
                <Link href={`/topics/${cls.id}`}>
                  <GlassCard className="p-3.5">
                    <div
                      className={`mb-3 flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br ${cls.color} text-2xl shadow-glow-sm`}
                    >
                      {cls.emoji}
                    </div>
                    <h3 className="text-sm font-semibold text-white">{cls.label}</h3>
                    <p className="mt-1 text-[11px] leading-4 text-white/45">{cls.description}</p>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          initial={iosFadeUp.initial}
          animate={iosFadeUp.animate}
          transition={{ ...iosFadeUp.transition, delay: 0.26 }}
          className="mb-7"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-brand-cyan" />
              <h2 className="text-lg font-semibold text-white">Daily Quests</h2>
            </div>
            <Link href="/quests" className="text-sm font-semibold text-brand-accent">
              Open
            </Link>
          </div>
          <div className="space-y-3">
            {quests.slice(0, 2).map((quest) => (
              <GlassCard key={quest.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="glass grid h-12 w-12 place-items-center rounded-[18px] text-2xl">
                    {quest.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-white">{quest.title}</h3>
                      <span className="text-xs font-semibold text-brand-accent">
                        {quest.progress}/{quest.total}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-white/52">{quest.description}</p>
                    <div className="mt-3 h-1.5 rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-purple"
                        style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={iosFadeUp.initial}
          animate={iosFadeUp.animate}
          transition={{ ...iosFadeUp.transition, delay: 0.3 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-cyan" />
              <h2 className="text-lg font-semibold text-white">Trending Lessons</h2>
            </div>
            <Link
              href="/library"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-accent"
            >
              Browse <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {spotlightTopics.map((topic) => (
              <Link
                href={{
                  pathname: `/viewer/${topic.id}`,
                  query: { from: '/' },
                }}
                key={topic.id}
              >
                <GlassCard className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br ${topic.color} text-3xl shadow-glow-sm`}
                    >
                      {topic.thumbnail}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-white">{topic.title}</h3>
                      <p className="truncate text-sm text-white/50">{topic.subtitle}</p>
                    </div>
                    <div className="glass-outline rounded-full px-3 py-1 text-[11px] font-semibold text-white/70">
                      {topic.category}
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </motion.section>
      </main>

      <AppMenuSheet
        open={showMenu}
        onClose={() => setShowMenu(false)}
        onOpenAuth={() => {
          setShowMenu(false);
          setShowAuth(true);
        }}
      />
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} onSubmit={signIn} />
    </>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Award, ArrowRight, Brain, Menu, Sparkles, Target } from 'lucide-react';
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
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
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
  const { badges, profile, quests, recentTopics, signIn, stats, topicProgress } = useAppState();
  const filteredClasses = CLASSES.filter((item) =>
    query === '' ? true : item.label.toLowerCase().includes(query.toLowerCase()),
  );
  const featuredTopic = TOPICS[0];
  const spotlightTopics = TOPICS.slice(1, 4);
  const quizTopics = getQuizTopics();
  const completedBadges = badges.filter((badge) => badge.unlocked);
  const nextQuest = quests.find((quest) => !quest.completed) ?? quests[0];
  const continueTopic = recentTopics[0];
  const favoriteCount = useMemo(
    () => Object.values(topicProgress).filter((entry) => entry.favorite).length,
    [topicProgress],
  );

  return (
    <>
      <main className="page-shell px-5 pt-10">
        <motion.section
          initial={iosFadeDown.initial}
          animate={iosFadeDown.animate}
          transition={iosFadeDown.transition}
          className="screen-header mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.button
              aria-label="Open app menu"
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowMenu(true)}
              className="glass h-11 w-11 rounded-[20px] grid place-items-center"
            >
              <Menu size={18} className="text-white/80" />
            </motion.button>
            <div>
              <p className="screen-kicker">AR School</p>
              <h1 className="screen-title text-gradient">
                Hello, {profile.isSignedIn ? profile.name.split(' ')[0] : 'Student'}!
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <InstallAppButton />
            <button
              type="button"
              aria-label={profile.isSignedIn ? 'Open profile and menu' : 'Create local student profile'}
              onClick={() => (profile.isSignedIn ? setShowMenu(true) : setShowAuth(true))}
              className="glass-purple flex h-11 min-w-11 items-center justify-center rounded-[20px] px-3 text-sm font-semibold text-white/85"
            >
              {profile.avatar}
            </button>
          </div>
        </motion.section>

        <motion.p
          initial={iosFadeUp.initial}
          animate={iosFadeUp.animate}
          transition={{ ...iosFadeUp.transition, delay: 0.1 }}
          className="screen-subtitle mb-5 max-w-lg"
        >
          Open lessons, place models in AR, ask the tutor, and keep your progress saved right on
          this device.
        </motion.p>

        <motion.div
          initial={iosFadeUp.initial}
          animate={iosFadeUp.animate}
          transition={{ ...iosFadeUp.transition, delay: 0.14 }}
          className="mb-4"
        >
          <SearchBar
            placeholder="Search classes, topics, or concepts..."
            onSearch={setQuery}
            className="w-full"
          />
        </motion.div>

        <motion.div
          initial={iosFadeUp.initial}
          animate={iosFadeUp.animate}
          transition={{ ...iosFadeUp.transition, delay: 0.18 }}
          className="mb-5 grid gap-3 sm:grid-cols-3"
        >
          <GlassCard variant="strong" className="p-4">
            <p className="screen-kicker">Progress</p>
            <p className="mt-2 text-2xl font-semibold text-white">{profile.xp} XP</p>
            <p className="mt-1 text-sm text-white/55">Level {profile.level} with {stats.topicsExplored} lessons explored.</p>
          </GlassCard>
          <GlassCard variant="strong" className="p-4">
            <p className="screen-kicker">Daily Quest</p>
            <p className="mt-2 text-base font-semibold text-white">{nextQuest.title}</p>
            <p className="mt-1 text-sm text-white/55">
              {nextQuest.progress}/{nextQuest.total} complete
            </p>
          </GlassCard>
          <GlassCard variant="strong" className="p-4">
            <p className="screen-kicker">Achievements</p>
            <p className="mt-2 text-2xl font-semibold text-white">{completedBadges.length}</p>
            <p className="mt-1 text-sm text-white/55">{favoriteCount} favorites saved for revision.</p>
          </GlassCard>
        </motion.div>

        {continueTopic ? (
          <motion.div
            initial={iosFadeUp.initial}
            animate={iosFadeUp.animate}
            transition={{ ...iosFadeUp.transition, delay: 0.2 }}
            className="mb-6"
          >
            <Link
              href={{
                pathname: `/viewer/${continueTopic.id}`,
                query: { from: '/' },
              }}
            >
              <GlassCard variant="purple" className="overflow-hidden p-5" glow>
                <div className="relative flex items-start justify-between gap-4">
                  <div className="max-w-[70%]">
                    <p className="screen-kicker text-white/70">Continue Learning</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{continueTopic.title}</h2>
                    <p className="mt-2 text-sm text-white/70">
                      Jump back into your most recent lesson and continue from where you left off.
                    </p>
                  </div>
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/12 bg-white/10 text-6xl shadow-glow-sm">
                    {continueTopic.thumbnail}
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ) : null}

        <motion.div
          initial={iosFadeUp.initial}
          animate={iosFadeUp.animate}
          transition={{ ...iosFadeUp.transition, delay: 0.22 }}
          className="mb-6 grid gap-3 sm:grid-cols-2"
        >
          <Link href="/quiz">
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="screen-kicker">Quiz Center</p>
                  <h2 className="mt-2 text-lg font-semibold text-white">Test what you learned</h2>
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
                  <h2 className="mt-2 text-lg font-semibold text-white">See your unlocked badges</h2>
                  <p className="mt-1 text-sm text-white/55">
                    {completedBadges.slice(0, 3).map((badge) => badge.title).join(', ') || 'Start learning to unlock your first badge.'}
                  </p>
                </div>
                <Award size={24} className="text-brand-accent" />
              </div>
            </GlassCard>
          </Link>
        </motion.div>

        <motion.div
          initial={iosFadeUp.initial}
          animate={iosFadeUp.animate}
          transition={{ ...iosFadeUp.transition, delay: 0.18 }}
          className="mb-6"
        >
          <Link
            href={{
              pathname: `/viewer/${featuredTopic.id}`,
              query: { from: '/' },
            }}
          >
            <GlassCard variant="purple" className="overflow-hidden p-5" glow>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/10 to-transparent" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="max-w-[70%]">
                  <p className="screen-kicker text-white/70">{featuredTopic.heroLabel}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{featuredTopic.title}</h2>
                  <p className="mt-2 text-sm text-white/70">{featuredTopic.subtitle}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {featuredTopic.stats.map((stat) => (
                      <span
                        key={stat}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/85"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/12 bg-white/10 text-6xl shadow-glow-sm">
                  {featuredTopic.thumbnail}
                </div>
              </div>
            </GlassCard>
          </Link>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...iosFadeUp.transition, delay: 0.24 }}
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
          transition={{ ...iosFadeUp.transition, delay: 0.3 }}
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
          transition={{ ...iosFadeUp.transition, delay: 0.34 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-cyan" />
              <h2 className="text-lg font-semibold text-white">Trending Lessons</h2>
            </div>
            <Link href="/library" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-accent">
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

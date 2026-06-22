'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LEADERBOARD_CITY, LEADERBOARD_GLOBAL, QUIZZES } from '@/lib/gamification';
import { TOPICS } from '@/lib/topics';

const STORAGE_KEY = 'ar-school-app-state-v2';

type MotionMode = 'smooth' | 'balanced' | 'reduced';

export interface StoredTopicProgress {
  viewed3d: boolean;
  viewedAR: boolean;
  aiChats: number;
  favorite: boolean;
  lastViewedAt?: string;
  quizAttempts: number;
  quizBestScore: number;
  quizBestTotal: number;
  quizRewardClaimed: number;
}

interface StoredAppState {
  user: {
    isSignedIn: boolean;
    name: string;
    email: string;
    classId: string;
    avatar: string;
  };
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  preferences: {
    audioEnabled: boolean;
    motionMode: MotionMode;
    hintsEnabled: boolean;
    showInstallPrompt: boolean;
  };
  topicProgress: Record<string, StoredTopicProgress>;
}

export interface AppBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface AppQuest {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  rewardXP: number;
  completed: boolean;
  icon: string;
}

export interface AppStats {
  topicsExplored: number;
  arSessions: number;
  aiChats: number;
  quizzesCompleted: number;
  favoriteTopics: number;
}

interface SignInPayload {
  avatar: string;
  classId: string;
  email: string;
  name: string;
}

interface AppStateContextValue {
  badges: AppBadge[];
  isHydrated: boolean;
  leaderboardCity: typeof LEADERBOARD_CITY;
  leaderboardGlobal: typeof LEADERBOARD_GLOBAL;
  preferences: StoredAppState['preferences'];
  profile: {
    avatar: string;
    classId: string;
    email: string;
    isSignedIn: boolean;
    level: number;
    name: string;
    streakDays: number;
    xp: number;
  };
  quests: AppQuest[];
  recentTopics: typeof TOPICS;
  stats: AppStats;
  topicProgress: Record<string, StoredTopicProgress>;
  completeQuiz: (topicId: string, score: number, total: number, rewardXP: number) => void;
  markAIQuestion: (topicId?: string) => void;
  markARSession: (topicId?: string) => void;
  markTopicViewed: (topicId?: string) => void;
  resetProgress: () => void;
  signIn: (payload: SignInPayload) => void;
  signOut: () => void;
  toggleFavorite: (topicId: string) => void;
  updatePreferences: (patch: Partial<StoredAppState['preferences']>) => void;
}

const defaultState: StoredAppState = {
  user: {
    isSignedIn: false,
    name: 'Guest Student',
    email: 'guest@arschool.app',
    classId: '6',
    avatar: '🧠',
  },
  xp: 180,
  streakDays: 1,
  lastActiveDate: '',
  preferences: {
    audioEnabled: true,
    motionMode: 'smooth',
    hintsEnabled: true,
    showInstallPrompt: true,
  },
  topicProgress: {},
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

function getTodayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function getLevelFromXp(xp: number) {
  return Math.max(1, Math.floor(xp / 500) + 1);
}

function ensureTopicProgress(
  progress: Record<string, StoredTopicProgress>,
  topicId: string,
) {
  return (
    progress[topicId] ?? {
      viewed3d: false,
      viewedAR: false,
      aiChats: 0,
      favorite: false,
      quizAttempts: 0,
      quizBestScore: 0,
      quizBestTotal: 0,
      quizRewardClaimed: 0,
    }
  );
}

function applyDailyStreak(state: StoredAppState) {
  const today = getTodayStamp();
  if (state.lastActiveDate === today) {
    return state;
  }

  if (!state.lastActiveDate) {
    return {
      ...state,
      lastActiveDate: today,
      streakDays: Math.max(1, state.streakDays),
    };
  }

  const last = new Date(state.lastActiveDate);
  const current = new Date(today);
  const diff = Math.round((current.getTime() - last.getTime()) / 86400000);

  return {
    ...state,
    lastActiveDate: today,
    streakDays: diff === 1 ? state.streakDays + 1 : 1,
  };
}

function buildBadges(
  progress: Record<string, StoredTopicProgress>,
  xp: number,
  streakDays: number,
): AppBadge[] {
  const topicsExplored = Object.values(progress).filter((entry) => entry.viewed3d).length;
  const arSessions = Object.values(progress).filter((entry) => entry.viewedAR).length;
  const aiChats = Object.values(progress).reduce((sum, entry) => sum + entry.aiChats, 0);
  const quizzesCompleted = Object.values(progress).filter((entry) => entry.quizBestScore > 0).length;
  const favorites = Object.values(progress).filter((entry) => entry.favorite).length;
  const perfectQuiz = Object.values(progress).some(
    (entry) => entry.quizBestTotal > 0 && entry.quizBestScore === entry.quizBestTotal,
  );

  return [
    {
      id: 'first-lesson',
      title: 'First Steps',
      description: 'Open your first interactive lesson.',
      icon: '🫀',
      unlocked: topicsExplored >= 1,
    },
    {
      id: 'room-scanner',
      title: 'Room Explorer',
      description: 'Place a model in AR.',
      icon: '🥽',
      unlocked: arSessions >= 1,
    },
    {
      id: 'ai-curious',
      title: 'AI Curious',
      description: 'Ask the assistant three useful questions.',
      icon: '🤖',
      unlocked: aiChats >= 3,
    },
    {
      id: 'quiz-master',
      title: 'Quiz Master',
      description: 'Complete a quiz with a perfect score.',
      icon: '🏆',
      unlocked: perfectQuiz,
    },
    {
      id: 'streak-keeper',
      title: 'Streak Keeper',
      description: 'Learn for three days in a row.',
      icon: '🔥',
      unlocked: streakDays >= 3,
    },
    {
      id: 'collector',
      title: 'Collector',
      description: 'Favorite three topics for later revision.',
      icon: '✨',
      unlocked: favorites >= 3,
    },
    {
      id: 'xp-riser',
      title: 'Level Up',
      description: 'Reach Level 3 or beyond.',
      icon: '⚡',
      unlocked: getLevelFromXp(xp) >= 3,
    },
    {
      id: 'all-rounder',
      title: 'All Rounder',
      description: 'Explore, chat, quiz, and place in AR.',
      icon: '🌌',
      unlocked:
        topicsExplored >= 2 &&
        arSessions >= 1 &&
        aiChats >= 1 &&
        quizzesCompleted >= 1,
    },
  ];
}

function buildQuests(progress: Record<string, StoredTopicProgress>): AppQuest[] {
  const topicsExplored = Object.values(progress).filter((entry) => entry.viewed3d).length;
  const arSessions = Object.values(progress).filter((entry) => entry.viewedAR).length;
  const aiChats = Object.values(progress).reduce((sum, entry) => sum + entry.aiChats, 0);
  const quizzesCompleted = Object.values(progress).filter(
    (entry) => entry.quizBestTotal > 0 && entry.quizBestScore / entry.quizBestTotal >= 0.6,
  ).length;

  return [
    {
      id: 'quest-models',
      title: 'Lesson Explorer',
      description: 'Open 3 different 3D lessons.',
      progress: Math.min(topicsExplored, 3),
      total: 3,
      rewardXP: 80,
      completed: topicsExplored >= 3,
      icon: '🔬',
    },
    {
      id: 'quest-ai',
      title: 'Ask the Tutor',
      description: 'Use the AI assistant twice.',
      progress: Math.min(aiChats, 2),
      total: 2,
      rewardXP: 60,
      completed: aiChats >= 2,
      icon: '🤖',
    },
    {
      id: 'quest-ar',
      title: 'AR Placement',
      description: 'Place any model in the real world once.',
      progress: Math.min(arSessions, 1),
      total: 1,
      rewardXP: 70,
      completed: arSessions >= 1,
      icon: '📱',
    },
    {
      id: 'quest-quiz',
      title: 'Quiz Checkpoint',
      description: 'Complete one quiz with 60% or better.',
      progress: Math.min(quizzesCompleted, 1),
      total: 1,
      rewardXP: 100,
      completed: quizzesCompleted >= 1,
      icon: '📝',
    },
  ];
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredAppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const nextState = raw ? (JSON.parse(raw) as StoredAppState) : defaultState;
      setState(applyDailyStreak(nextState));
    } catch {
      setState(applyDailyStreak(defaultState));
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    document.body.dataset.motionMode = state.preferences.motionMode;
  }, [hydrated, state]);

  const updateState = useCallback((updater: (current: StoredAppState) => StoredAppState) => {
    setState((current) => applyDailyStreak(updater(current)));
  }, []);

  const markTopicViewed = useCallback((topicId?: string) => {
    if (!topicId) return;
    updateState((current) => {
      const entry = ensureTopicProgress(current.topicProgress, topicId);
      if (entry.viewed3d) {
        return {
          ...current,
          topicProgress: {
            ...current.topicProgress,
            [topicId]: {
              ...entry,
              lastViewedAt: new Date().toISOString(),
            },
          },
        };
      }

      return {
        ...current,
        xp: current.xp + 40,
        topicProgress: {
          ...current.topicProgress,
          [topicId]: {
            ...entry,
            viewed3d: true,
            lastViewedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, [updateState]);

  const markARSession = useCallback((topicId?: string) => {
    if (!topicId) return;
    updateState((current) => {
      const entry = ensureTopicProgress(current.topicProgress, topicId);
      if (entry.viewedAR) {
        return current;
      }

      return {
        ...current,
        xp: current.xp + 60,
        topicProgress: {
          ...current.topicProgress,
          [topicId]: {
            ...entry,
            viewed3d: true,
            viewedAR: true,
            lastViewedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, [updateState]);

  const markAIQuestion = useCallback((topicId?: string) => {
    if (!topicId) return;
    updateState((current) => {
      const entry = ensureTopicProgress(current.topicProgress, topicId);
      const awardedXp = entry.aiChats < 5 ? 10 : 4;

      return {
        ...current,
        xp: current.xp + awardedXp,
        topicProgress: {
          ...current.topicProgress,
          [topicId]: {
            ...entry,
            viewed3d: true,
            aiChats: entry.aiChats + 1,
            lastViewedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, [updateState]);

  const completeQuiz = useCallback((
    topicId: string,
    score: number,
    total: number,
    rewardXP: number,
  ) => {
    updateState((current) => {
      const entry = ensureTopicProgress(current.topicProgress, topicId);
      const earned = Math.round((score / total) * rewardXP);
      const xpDelta = Math.max(0, earned - entry.quizRewardClaimed);

      return {
        ...current,
        xp: current.xp + xpDelta,
        topicProgress: {
          ...current.topicProgress,
          [topicId]: {
            ...entry,
            viewed3d: true,
            quizAttempts: entry.quizAttempts + 1,
            quizBestScore:
              score / total >= entry.quizBestScore / Math.max(entry.quizBestTotal, 1)
                ? score
                : entry.quizBestScore,
            quizBestTotal:
              score / total >= entry.quizBestScore / Math.max(entry.quizBestTotal, 1)
                ? total
                : entry.quizBestTotal,
            quizRewardClaimed: Math.max(entry.quizRewardClaimed, earned),
            lastViewedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, [updateState]);

  const toggleFavorite = useCallback((topicId: string) => {
    updateState((current) => {
      const entry = ensureTopicProgress(current.topicProgress, topicId);
      return {
        ...current,
        topicProgress: {
          ...current.topicProgress,
          [topicId]: {
            ...entry,
            favorite: !entry.favorite,
            lastViewedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, [updateState]);

  const updatePreferences = useCallback((patch: Partial<StoredAppState['preferences']>) => {
    updateState((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        ...patch,
      },
    }));
  }, [updateState]);

  const signIn = useCallback((payload: SignInPayload) => {
    updateState((current) => ({
      ...current,
      user: {
        isSignedIn: true,
        name: payload.name,
        email: payload.email,
        classId: payload.classId,
        avatar: payload.avatar,
      },
    }));
  }, [updateState]);

  const signOut = useCallback(() => {
    updateState((current) => ({
      ...current,
      user: {
        ...current.user,
        isSignedIn: false,
        name: 'Guest Student',
        email: 'guest@arschool.app',
        classId: current.user.classId || '6',
        avatar: '🧠',
      },
    }));
  }, [updateState]);

  const resetProgress = useCallback(() => {
    setState((current) => ({
      ...defaultState,
      user: current.user,
      preferences: current.preferences,
      lastActiveDate: getTodayStamp(),
    }));
  }, []);

  const stats = useMemo<AppStats>(() => ({
    topicsExplored: Object.values(state.topicProgress).filter((entry) => entry.viewed3d).length,
    arSessions: Object.values(state.topicProgress).filter((entry) => entry.viewedAR).length,
    aiChats: Object.values(state.topicProgress).reduce((sum, entry) => sum + entry.aiChats, 0),
    quizzesCompleted: Object.values(state.topicProgress).filter((entry) => entry.quizBestTotal > 0)
      .length,
    favoriteTopics: Object.values(state.topicProgress).filter((entry) => entry.favorite).length,
  }), [state.topicProgress]);

  const badges = useMemo(
    () => buildBadges(state.topicProgress, state.xp, state.streakDays),
    [state.streakDays, state.topicProgress, state.xp],
  );

  const quests = useMemo(() => buildQuests(state.topicProgress), [state.topicProgress]);

  const recentTopics = useMemo(() => {
    return [...TOPICS]
      .filter((topic) => state.topicProgress[topic.id]?.lastViewedAt)
      .sort((left, right) => {
        const leftTime = state.topicProgress[left.id]?.lastViewedAt ?? '';
        const rightTime = state.topicProgress[right.id]?.lastViewedAt ?? '';
        return rightTime.localeCompare(leftTime);
      });
  }, [state.topicProgress]);

  const leaderboardGlobal = useMemo(() => {
    const level = getLevelFromXp(state.xp);
    const currentUser = {
      id: 'current-user',
      username: state.user.name,
      avatar: state.user.avatar,
      xp: state.xp,
      level,
      isCurrentUser: true,
    };

    return [...LEADERBOARD_GLOBAL.filter((entry) => !entry.isCurrentUser), currentUser].sort(
      (left, right) => right.xp - left.xp,
    );
  }, [state.user.avatar, state.user.name, state.xp]);

  const leaderboardCity = useMemo(() => {
    const level = getLevelFromXp(state.xp);
    const currentUser = {
      id: 'current-user',
      username: state.user.name,
      avatar: state.user.avatar,
      xp: state.xp,
      level,
      isCurrentUser: true,
    };

    return [...LEADERBOARD_CITY.filter((entry) => !entry.isCurrentUser), currentUser].sort(
      (left, right) => right.xp - left.xp,
    );
  }, [state.user.avatar, state.user.name, state.xp]);

  const value = useMemo<AppStateContextValue>(() => ({
    badges,
    isHydrated: hydrated,
    leaderboardCity,
    leaderboardGlobal,
    preferences: state.preferences,
    profile: {
      avatar: state.user.avatar,
      classId: state.user.classId,
      email: state.user.email,
      isSignedIn: state.user.isSignedIn,
      level: getLevelFromXp(state.xp),
      name: state.user.name,
      streakDays: state.streakDays,
      xp: state.xp,
    },
    quests,
    recentTopics,
    stats,
    topicProgress: state.topicProgress,
    completeQuiz,
    markAIQuestion,
    markARSession,
    markTopicViewed,
    resetProgress,
    signIn,
    signOut,
    toggleFavorite,
    updatePreferences,
  }), [
    badges,
    completeQuiz,
    hydrated,
    leaderboardCity,
    leaderboardGlobal,
    markAIQuestion,
    markARSession,
    markTopicViewed,
    quests,
    recentTopics,
    resetProgress,
    signIn,
    signOut,
    state.preferences,
    state.streakDays,
    state.topicProgress,
    state.user.avatar,
    state.user.classId,
    state.user.email,
    state.user.isSignedIn,
    state.user.name,
    state.xp,
    stats,
    toggleFavorite,
    updatePreferences,
  ]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}

export function getQuizTopics() {
  return TOPICS.filter((topic) => topic.id in QUIZZES);
}

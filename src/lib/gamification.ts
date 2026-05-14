// ─── Gamification Types ─────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  topicId: string;
  title: string;
  questions: QuizQuestion[];
  rewardXP: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  isCurrentUser?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  rewardXP: number;
  completed: boolean;
  icon: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserProfile {
  username: string;
  xp: number;
  level: number;
  streakDays: number;
  badges: Badge[];
}

// ─── Mock Data ────────────────────────────────────────────────

export const USER_PROFILE: UserProfile = {
  username: 'Student Explorer',
  xp: 1250,
  level: 5,
  streakDays: 3,
  badges: [
    { id: 'b1', title: 'First Steps', description: 'View your first 3D model.', icon: '👶', unlockedAt: '2026-05-01T12:00:00Z' },
    { id: 'b2', title: 'Biology Whiz', description: 'Score 100% on a Biology quiz.', icon: '🧬', unlockedAt: '2026-05-03T15:30:00Z' },
    { id: 'b3', title: 'Space Ranger', description: 'Explore all space models.', icon: '🚀' }, // Locked
  ],
};

export const QUIZZES: Record<string, Quiz> = {
  heart: {
    topicId: 'heart',
    title: 'Human Heart Mastery',
    rewardXP: 100,
    questions: [
      { id: 'q1', question: 'How many chambers does the human heart have?', options: ['Two', 'Three', 'Four', 'Five'], correctAnswerIndex: 2 },
      { id: 'q2', question: 'What is the main function of the heart?', options: ['Digest food', 'Pump blood', 'Filter air', 'Store memories'], correctAnswerIndex: 1 },
      { id: 'q3', question: 'Which blood vessels carry oxygenated blood away from the heart?', options: ['Veins', 'Arteries', 'Capillaries', 'Ventricles'], correctAnswerIndex: 1 },
    ]
  },
  'solar-system': {
    topicId: 'solar-system',
    title: 'Solar System Quiz',
    rewardXP: 120,
    questions: [
      { id: 'q1', question: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctAnswerIndex: 2 },
      { id: 'q2', question: 'What is the largest planet in our solar system?', options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'], correctAnswerIndex: 1 },
      { id: 'q3', question: 'What force keeps planets in orbit?', options: ['Magnetism', 'Friction', 'Gravity', 'Tension'], correctAnswerIndex: 2 },
    ]
  }
};

export const DAILY_QUESTS: Quest[] = [
  { id: 'q1', title: 'Daily Explorer', description: 'View 2 different 3D models', progress: 1, total: 2, rewardXP: 50, completed: false, icon: '🔭' },
  { id: 'q2', title: 'Knowledge Seeker', description: 'Ask the AI Assistant a question', progress: 1, total: 1, rewardXP: 30, completed: true, icon: '🤖' },
  { id: 'q3', title: 'Quiz Master', description: 'Score at least 80% on a quiz', progress: 0, total: 1, rewardXP: 100, completed: false, icon: '🏆' },
];

export const LEADERBOARD_GLOBAL: LeaderboardEntry[] = [
  { id: 'u1', username: 'Einstein2026', avatar: '🧠', xp: 5420, level: 12 },
  { id: 'u2', username: 'MarieCurie_fan', avatar: '🔬', xp: 5100, level: 11 },
  { id: 'u3', username: 'AstroBoy', avatar: '🚀', xp: 4890, level: 10 },
  { id: 'u4', username: 'Student Explorer', avatar: '🎓', xp: 1250, level: 5, isCurrentUser: true },
  { id: 'u5', username: 'Newbie123', avatar: '👶', xp: 400, level: 2 },
];

export const LEADERBOARD_CITY: LeaderboardEntry[] = [
  { id: 'u6', username: 'LocalHero', avatar: '🦸', xp: 2100, level: 7 },
  { id: 'u4', username: 'Student Explorer', avatar: '🎓', xp: 1250, level: 5, isCurrentUser: true },
  { id: 'u7', username: 'CityLearner', avatar: '📚', xp: 950, level: 4 },
];

export function getLevelProgress(xp: number, level: number) {
  // Simple formula: each level requires level * 500 XP
  const xpForCurrentLevel = (level - 1) * 500;
  const xpForNextLevel = level * 500;
  const progress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
  return { progress: Math.max(0, Math.min(100, progress)), nextLevelXP: xpForNextLevel };
}

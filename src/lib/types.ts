// ─── Topic / Class Types ──────────────────────────────────────
export interface ClassItem {
  id: string;
  label: string;
  emoji: string;
  color: string; // tailwind gradient class
}

export interface TopicCard {
  id: string;
  title: string;
  category: string;
  thumbnail: string; // emoji or url
  color: string;
  description: string;
  modelUrl: string; // CDN url to .glb
  classIds: string[];
}

export type TopicCategory = 'All' | 'Science' | 'Space' | 'Vehicles' | 'Plants' | 'History';

// ─── Chat Types ───────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedTopics?: string[];
}

// ─── AR Session Types ─────────────────────────────────────────
export type ARSessionState = 'idle' | 'starting' | 'active' | 'error' | 'unsupported';

export interface ARSessionControls {
  state: ARSessionState;
  start: () => Promise<void>;
  end: () => void;
  error: string | null;
}

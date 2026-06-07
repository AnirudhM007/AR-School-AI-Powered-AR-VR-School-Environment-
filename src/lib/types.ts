export type TopicCategory =
  | 'All'
  | 'Science'
  | 'Space'
  | 'Vehicles'
  | 'Plants'
  | 'Earth';

export type Vec3 = [number, number, number];
export type Quat = [number, number, number, number];

export interface XRPlacement {
  position: Vec3;
  rotation: Quat;
  anchor?: XRAnchor | null;
}

export interface TopicAnnotation {
  id: string;
  label: string;
  description: string;
  position: Vec3;
  questionPrompt: string;
  meshKeywords?: string[];
}

export interface ClassItem {
  id: string;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

export interface TopicCard {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<TopicCategory, 'All'>;
  thumbnail: string;
  color: string;
  description: string;
  heroLabel: string;
  stats: string[];
  relatedTopics: string[];
  quickQuestions: string[];
  modelUrl: string;
  classIds: string[];
  modelScale?: number;
  modelPosition?: Vec3;
  arPlacementOffset?: Vec3;
  annotations: TopicAnnotation[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedTopics?: string[];
}

export type ARSessionState = 'idle' | 'starting' | 'active' | 'error' | 'unsupported';

export interface ARSessionControls {
  state: ARSessionState;
  start: () => Promise<void>;
  end: () => void;
  error: string | null;
}

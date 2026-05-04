import { ClassItem, TopicCard } from './types';

export const CLASSES: ClassItem[] = [
  { id: '1',  label: 'Class 1',  emoji: '📚', color: 'from-purple-600 to-indigo-600' },
  { id: '2',  label: 'Class 2',  emoji: '🔬', color: 'from-blue-600 to-cyan-600' },
  { id: '3',  label: 'Class 3',  emoji: '🌱', color: 'from-emerald-600 to-teal-600' },
  { id: '4',  label: 'Class 4',  emoji: '🚀', color: 'from-violet-600 to-purple-600' },
  { id: '5',  label: 'Class 5',  emoji: '⚡', color: 'from-yellow-600 to-orange-600' },
  { id: '6',  label: 'Class 6',  emoji: '🧬', color: 'from-pink-600 to-rose-600' },
  { id: '7',  label: 'Class 7',  emoji: '🧠', color: 'from-red-600 to-pink-600' },
  { id: '8',  label: 'Class 8',  emoji: '🌍', color: 'from-green-600 to-emerald-600' },
  { id: '9',  label: 'Class 9',  emoji: '⚗️', color: 'from-cyan-600 to-blue-600' },
  { id: '10', label: 'Class 10', emoji: '🎓', color: 'from-indigo-600 to-violet-600' },
];

// Free CDN .glb model URLs (KhronosGroup GLTF samples & Sketchfab free downloads)
export const TOPICS: TopicCard[] = [
  {
    id: 'heart',
    title: 'Human Heart',
    category: 'Science',
    thumbnail: '❤️',
    color: 'from-red-500 to-pink-600',
    description: 'The human heart is a muscular organ that pumps blood throughout the body, delivering oxygen and nutrients to tissues.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb',
    classIds: ['6', '7', '8', '9', '10'],
  },
  {
    id: 'solar-system',
    title: 'Solar System',
    category: 'Space',
    thumbnail: '🪐',
    color: 'from-blue-500 to-indigo-600',
    description: 'Our Solar System consists of the Sun and all celestial bodies that orbit it, including 8 planets.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Lantern/glTF-Binary/Lantern.glb',
    classIds: ['1', '2', '3', '4', '5', '6'],
  },
  {
    id: 'electric-circuit',
    title: 'Electric Circuit',
    category: 'Science',
    thumbnail: '⚡',
    color: 'from-yellow-500 to-orange-600',
    description: 'An electric circuit is a path through which electrons flow from a voltage or current source.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ToyCar/glTF-Binary/ToyCar.glb',
    classIds: ['7', '8', '9', '10'],
  },
  {
    id: 'plant-cell',
    title: 'Plant Cell',
    category: 'Plants',
    thumbnail: '🌿',
    color: 'from-green-500 to-emerald-600',
    description: 'Plant cells have a cell wall, chloroplasts, and a large central vacuole, unlike animal cells.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ABeautifulGame/glTF-Binary/ABeautifulGame.glb',
    classIds: ['5', '6', '7', '8'],
  },
  {
    id: 'volcano',
    title: 'Volcano',
    category: 'Science',
    thumbnail: '🌋',
    color: 'from-orange-500 to-red-600',
    description: 'A volcano is a rupture in the Earth\'s crust where molten lava, ash, and gases escape from a magma chamber.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DragonAttenuation/glTF-Binary/DragonAttenuation.glb',
    classIds: ['4', '5', '6', '7'],
  },
  {
    id: 'brain',
    title: 'The Brain',
    category: 'Science',
    thumbnail: '🧠',
    color: 'from-violet-500 to-purple-600',
    description: 'The human brain is the control center of the body, managing all thoughts, memories, emotions, and senses.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb',
    classIds: ['8', '9', '10'],
  },
  {
    id: 'dna',
    title: 'DNA Helix',
    category: 'Science',
    thumbnail: '🧬',
    color: 'from-cyan-500 to-blue-600',
    description: 'DNA (Deoxyribonucleic acid) is a double helix molecule carrying genetic instructions for all living organisms.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF-Binary/Suzanne.glb',
    classIds: ['9', '10'],
  },
  {
    id: 'water-cycle',
    title: 'Water Cycle',
    category: 'Science',
    thumbnail: '💧',
    color: 'from-blue-400 to-cyan-500',
    description: 'The water cycle describes how water evaporates, condenses, and precipitates continuously on Earth.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Box/glTF-Binary/Box.glb',
    classIds: ['3', '4', '5', '6'],
  },
];

export const CATEGORIES = ['All', 'Science', 'Space', 'Vehicles', 'Plants', 'History'] as const;

export function getTopicsByClass(classId: string): TopicCard[] {
  return TOPICS.filter(t => t.classIds.includes(classId));
}

export function getTopicById(id: string): TopicCard | undefined {
  return TOPICS.find(t => t.id === id);
}

export function getTopicsByCategory(category: string): TopicCard[] {
  if (category === 'All') return TOPICS;
  return TOPICS.filter(t => t.category === category);
}

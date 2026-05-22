import { ClassItem, TopicAnnotation, TopicCard, TopicCategory } from './types';

export const CLASSES: ClassItem[] = [
  { id: '1', label: 'Class 1', emoji: '📘', color: 'from-sky-500 to-blue-600', description: 'Foundations and curious first explorations.' },
  { id: '2', label: 'Class 2', emoji: '📖', color: 'from-indigo-500 to-blue-700', description: 'Early science stories and simple systems.' },
  { id: '3', label: 'Class 3', emoji: '🧪', color: 'from-cyan-500 to-sky-700', description: 'Observation-led activities and model play.' },
  { id: '4', label: 'Class 4', emoji: '🌋', color: 'from-orange-500 to-rose-600', description: 'Natural processes and energetic reactions.' },
  { id: '5', label: 'Class 5', emoji: '🌱', color: 'from-emerald-500 to-green-700', description: 'Life sciences, matter, and ecosystems.' },
  { id: '6', label: 'Class 6', emoji: '🪐', color: 'from-violet-500 to-fuchsia-600', description: 'The first deep dive into immersive science.' },
  { id: '7', label: 'Class 7', emoji: '⚙️', color: 'from-amber-400 to-orange-600', description: 'Systems, circuits, and motion in action.' },
  { id: '8', label: 'Class 8', emoji: '🫀', color: 'from-rose-500 to-red-600', description: 'Human biology and complex living systems.' },
  { id: '9', label: 'Class 9', emoji: '🧠', color: 'from-purple-500 to-indigo-600', description: 'Advanced structures and scientific reasoning.' },
  { id: '10', label: 'Class 10', emoji: '🧬', color: 'from-fuchsia-500 to-violet-700', description: 'Exam-ready revision with interactive models.' },
];

const heartAnnotations: TopicAnnotation[] = [
  {
    id: 'aorta',
    label: 'Aorta',
    description: 'The aorta is the main artery that carries oxygen-rich blood from the heart to the rest of the body.',
    position: [0.05, 0.78, 0.2],
    questionPrompt: 'What does the aorta do and why is it important?',
    meshKeywords: ['aorta', 'artery', 'vessel'],
  },
  {
    id: 'atria',
    label: 'Atria',
    description: 'The left and right atria are the upper chambers that receive blood returning to the heart.',
    position: [-0.35, 0.3, 0.15],
    questionPrompt: 'How do the atria and ventricles work together?',
    meshKeywords: ['atrium', 'atria', 'upper'],
  },
  {
    id: 'ventricles',
    label: 'Ventricles',
    description: 'The ventricles are the lower chambers that pump blood out of the heart with strong muscular walls.',
    position: [0.12, -0.55, 0.28],
    questionPrompt: 'Why are the ventricles more muscular than the atria?',
    meshKeywords: ['ventricle', 'lower'],
  },
];

const solarAnnotations: TopicAnnotation[] = [
  {
    id: 'sun',
    label: 'The Sun',
    description: 'The Sun is the star at the center of the Solar System and provides light and energy to the planets.',
    position: [0, 0.1, 0],
    questionPrompt: 'Why is the Sun considered a star and not a planet?',
    meshKeywords: ['sun', 'star', 'core'],
  },
  {
    id: 'inner-planets',
    label: 'Inner Planets',
    description: 'Mercury, Venus, Earth, and Mars are the rocky inner planets located closest to the Sun.',
    position: [-0.7, -0.15, 0.2],
    questionPrompt: 'What makes the inner planets different from the outer planets?',
    meshKeywords: ['mercury', 'venus', 'earth', 'mars', 'inner'],
  },
  {
    id: 'outer-planets',
    label: 'Outer Planets',
    description: 'Jupiter, Saturn, Uranus, and Neptune are larger outer planets made mostly of gas and ice.',
    position: [0.78, 0.24, -0.15],
    questionPrompt: 'Why are the outer planets much larger than the inner planets?',
    meshKeywords: ['jupiter', 'saturn', 'uranus', 'neptune', 'outer'],
  },
];

const circuitAnnotations: TopicAnnotation[] = [
  {
    id: 'source',
    label: 'Power Source',
    description: 'A battery or cell pushes electric charges through the circuit by providing voltage.',
    position: [-0.72, 0.16, 0.24],
    questionPrompt: 'What job does the battery do in a circuit?',
    meshKeywords: ['battery', 'cell', 'source'],
  },
  {
    id: 'path',
    label: 'Conductive Path',
    description: 'Wires form a closed path that lets current move from one component to the next.',
    position: [0.1, -0.2, 0.3],
    questionPrompt: 'Why does current need a closed path to flow?',
    meshKeywords: ['wire', 'path', 'connector'],
  },
  {
    id: 'load',
    label: 'Load',
    description: 'The load, such as a bulb or motor, uses electrical energy to do useful work.',
    position: [0.6, 0.24, 0.15],
    questionPrompt: 'How does the load use electrical energy in a circuit?',
    meshKeywords: ['bulb', 'motor', 'load', 'lamp'],
  },
];

const plantAnnotations: TopicAnnotation[] = [
  {
    id: 'nucleus',
    label: 'Nucleus',
    description: 'The nucleus stores genetic material and directs many of the cell’s activities.',
    position: [0.08, 0.02, 0.42],
    questionPrompt: 'Why is the nucleus called the control center of the cell?',
    meshKeywords: ['nucleus', 'center'],
  },
  {
    id: 'chloroplast',
    label: 'Chloroplast',
    description: 'Chloroplasts contain chlorophyll and allow plants to make food through photosynthesis.',
    position: [-0.48, 0.36, 0.12],
    questionPrompt: 'How do chloroplasts help a plant make food?',
    meshKeywords: ['chloroplast', 'green'],
  },
  {
    id: 'vacuole',
    label: 'Central Vacuole',
    description: 'The central vacuole stores water and helps the plant cell stay firm and supported.',
    position: [0.52, -0.18, 0.18],
    questionPrompt: 'What does the vacuole do for a plant cell?',
    meshKeywords: ['vacuole', 'storage'],
  },
];

const volcanoAnnotations: TopicAnnotation[] = [
  {
    id: 'magma',
    label: 'Magma Chamber',
    description: 'The magma chamber is the underground reservoir where molten rock collects before eruptions.',
    position: [0, -0.62, 0.18],
    questionPrompt: 'What happens inside a magma chamber before an eruption?',
    meshKeywords: ['magma', 'chamber'],
  },
  {
    id: 'vent',
    label: 'Main Vent',
    description: 'The vent is the passage that lets magma travel upward toward the surface.',
    position: [0.06, 0.08, 0.26],
    questionPrompt: 'How does magma move through a volcano?',
    meshKeywords: ['vent', 'pipe', 'main'],
  },
  {
    id: 'ash-cloud',
    label: 'Ash Cloud',
    description: 'During eruptions, ash and gases can rise high into the atmosphere above the crater.',
    position: [0.02, 0.62, 0.04],
    questionPrompt: 'Why do ash clouds form during volcanic eruptions?',
    meshKeywords: ['ash', 'cloud', 'smoke'],
  },
];

const brainAnnotations: TopicAnnotation[] = [
  {
    id: 'cerebrum',
    label: 'Cerebrum',
    description: 'The cerebrum controls thinking, memory, language, and voluntary movement.',
    position: [0.18, 0.34, 0.3],
    questionPrompt: 'What kinds of tasks does the cerebrum control?',
    meshKeywords: ['cerebrum', 'brain'],
  },
  {
    id: 'cerebellum',
    label: 'Cerebellum',
    description: 'The cerebellum helps coordinate balance, posture, and smooth movement.',
    position: [-0.34, -0.38, 0.18],
    questionPrompt: 'How does the cerebellum help us balance and move smoothly?',
    meshKeywords: ['cerebellum', 'balance'],
  },
  {
    id: 'brainstem',
    label: 'Brainstem',
    description: 'The brainstem controls automatic functions like breathing, heartbeat, and digestion.',
    position: [0.02, -0.58, 0.16],
    questionPrompt: 'Why is the brainstem essential for survival?',
    meshKeywords: ['brainstem', 'stem'],
  },
];

export const TOPICS: TopicCard[] = [
  {
    id: 'heart',
    title: 'Human Heart',
    subtitle: 'Circulatory system in motion',
    category: 'Science',
    thumbnail: '🫀',
    color: 'from-rose-500 via-red-500 to-orange-500',
    description: 'Explore the heart in 3D, inspect major chambers and vessels, and understand how blood moves through the body.',
    heroLabel: 'Class 6 Spotlight',
    stats: ['3 key parts', 'AR ready', 'Biology'],
    relatedTopics: ['Circulatory System', 'Blood Flow', 'Arteries'],
    quickQuestions: [
      'What is the function of the human heart?',
      'Why are ventricles thicker than atria?',
      'How does oxygen-rich blood move through the body?',
    ],
    modelUrl: '/models/human-heart.glb',
    classIds: ['6', '7', '8', '9', '10'],
    modelScale: 1.3,
    annotations: heartAnnotations,
  },
  {
    id: 'solar-system',
    title: 'Solar System',
    subtitle: 'Planetary motion and orbit',
    category: 'Space',
    thumbnail: '🪐',
    color: 'from-sky-500 via-indigo-500 to-violet-600',
    description: 'Zoom through the Solar System to compare the Sun, inner planets, and the giant outer worlds.',
    heroLabel: 'Space Explorer',
    stats: ['8 planets', 'Orbit view', 'AR ready'],
    relatedTopics: ['Planets', 'Gravity', 'Orbits'],
    quickQuestions: [
      'Why do planets stay in orbit?',
      'What separates inner and outer planets?',
      'Why is the Sun the center of the Solar System?',
    ],
    modelUrl: 'procedural:solar-system',
    classIds: ['3', '4', '5', '6', '7'],
    modelScale: 1.2,
    annotations: solarAnnotations,
  },
  {
    id: 'electric-circuit',
    title: 'Electric Circuit',
    subtitle: 'See current flow visually',
    category: 'Science',
    thumbnail: '⚡',
    color: 'from-amber-400 via-orange-500 to-rose-500',
    description: 'Trace how power moves from a battery through wires and components in a complete circuit.',
    heroLabel: 'Physics Lab',
    stats: ['3 core parts', 'Interactive', 'Quiz ready'],
    relatedTopics: ["Ohm's Law", 'Voltage', 'Resistance'],
    quickQuestions: [
      'What makes a circuit complete?',
      'What is the job of the battery?',
      'Why does a bulb stop glowing in an open circuit?',
    ],
    modelUrl: 'procedural:electric-circuit',
    classIds: ['6', '7', '8', '9', '10'],
    modelScale: 1.15,
    annotations: circuitAnnotations,
  },
  {
    id: 'plant-cell',
    title: 'Plant Cell',
    subtitle: 'Inside a living cell',
    category: 'Plants',
    thumbnail: '🪴',
    color: 'from-emerald-400 via-green-500 to-lime-500',
    description: 'Inspect the nucleus, chloroplasts, and vacuole to understand how plant cells stay alive and make food.',
    heroLabel: 'Life Science',
    stats: ['Cell structures', 'Photosynthesis', 'AR ready'],
    relatedTopics: ['Photosynthesis', 'Cell Wall', 'Organelles'],
    quickQuestions: [
      'Why do plant cells have chloroplasts?',
      'What does the nucleus control?',
      'How does the vacuole help the cell?',
    ],
    modelUrl: 'procedural:plant-cell',
    classIds: ['5', '6', '7', '8'],
    modelScale: 1.15,
    annotations: plantAnnotations,
  },
  {
    id: 'volcano',
    title: 'Volcano',
    subtitle: 'Earth processes in 3D',
    category: 'Earth',
    thumbnail: '🌋',
    color: 'from-orange-500 via-red-500 to-zinc-800',
    description: 'Understand how magma rises, eruptions form, and ash clouds spread during volcanic activity.',
    heroLabel: 'Earth Science',
    stats: ['3 zones', 'Dynamic view', 'AR ready'],
    relatedTopics: ['Magma', 'Eruptions', 'Tectonic Plates'],
    quickQuestions: [
      'How does magma reach the surface?',
      'Why do volcanoes erupt?',
      'What is the difference between lava and magma?',
    ],
    modelUrl: 'procedural:volcano',
    classIds: ['4', '5', '6', '7'],
    modelScale: 1.1,
    annotations: volcanoAnnotations,
  },
  {
    id: 'brain',
    title: 'The Brain',
    subtitle: 'Control center of the body',
    category: 'Science',
    thumbnail: '🧠',
    color: 'from-fuchsia-500 via-violet-500 to-indigo-600',
    description: 'Explore how the cerebrum, cerebellum, and brainstem help the body think, move, and survive.',
    heroLabel: 'Advanced Biology',
    stats: ['3 key regions', 'AI guided', 'AR ready'],
    relatedTopics: ['Neurons', 'Nervous System', 'Senses'],
    quickQuestions: [
      'What does the brainstem control?',
      'How does the cerebellum affect movement?',
      'Why is the cerebrum important for learning?',
    ],
    modelUrl: 'procedural:brain',
    classIds: ['8', '9', '10'],
    modelScale: 1.2,
    annotations: brainAnnotations,
  },
];

export const CATEGORIES: TopicCategory[] = ['All', 'Science', 'Space', 'Vehicles', 'Plants', 'Earth'];

export function getTopicsByClass(classId: string): TopicCard[] {
  return TOPICS.filter((topic) => topic.classIds.includes(classId));
}

export function getTopicById(id: string): TopicCard | undefined {
  return TOPICS.find((topic) => topic.id === id);
}

export function getTopicsByCategory(category: TopicCategory): TopicCard[] {
  if (category === 'All') return TOPICS;
  return TOPICS.filter((topic) => topic.category === category);
}

export function getTopicAnnotation(topicId: string, annotationId: string) {
  return getTopicById(topicId)?.annotations.find((annotation) => annotation.id === annotationId);
}

export function buildTopicContext(topic?: TopicCard, annotationId?: string | null) {
  if (!topic) return undefined;
  const annotation = annotationId ? getTopicAnnotation(topic.id, annotationId) : undefined;
  if (!annotation) {
    return {
      topicId: topic.id,
      topicTitle: topic.title,
      prompt: undefined,
      selectedLabel: undefined,
    };
  }

  return {
    topicId: topic.id,
    topicTitle: topic.title,
    prompt: annotation.questionPrompt,
    selectedLabel: annotation.label,
  };
}

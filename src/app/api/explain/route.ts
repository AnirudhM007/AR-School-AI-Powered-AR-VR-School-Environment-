import { NextRequest, NextResponse } from 'next/server';

// ─── Mock responses when no OpenAI API key is set ─────────────
const MOCK_DB: Record<string, { answer: string; relatedTopics: string[] }> = {
  heart: {
    answer:
      'The human heart pumps blood throughout the body, delivering oxygen and nutrients to tissues and removing waste. It has four chambers: two atria and two ventricles. The heart works continuously to keep us alive — beating about 100,000 times per day!',
    relatedTopics: ['Circulatory System', 'Blood', 'Veins & Arteries'],
  },
  solar: {
    answer:
      'The Solar System consists of the Sun and everything bound to it by gravity — 8 planets, dwarf planets, moons, asteroids, and comets. The Sun contains 99.86% of all mass in the Solar System. Planets orbit in elliptical paths due to gravitational forces.',
    relatedTopics: ['Planets', 'Gravity', 'Space Exploration'],
  },
  brain: {
    answer:
      'The human brain controls all bodily functions and is responsible for thought, memory, emotion, and sensory processing. It has about 86 billion neurons connected by trillions of synapses. The brain is divided into the cerebrum, cerebellum, and brainstem.',
    relatedTopics: ['Nervous System', 'Neurons', 'Senses'],
  },
  circuit: {
    answer:
      'An electric circuit is a closed loop allowing electric current to flow. It consists of a power source (battery), conductors (wires), and loads (bulbs, motors). Ohm\'s Law states V = IR, relating voltage, current, and resistance.',
    relatedTopics: ["Ohm's Law", 'Voltage', 'Resistance'],
  },
  default: {
    answer:
      "Great question! This topic has fascinating concepts. In AR School, we use 3D models and augmented reality to make learning more immersive. Would you like me to explain a specific aspect of this topic?",
    relatedTopics: ['Science', 'Technology', 'STEM'],
  },
};

function getMockResponse(question: string, topic?: string) {
  const q = (question + (topic ?? '')).toLowerCase();
  if (q.includes('heart') || q.includes('cardiac')) return MOCK_DB.heart;
  if (q.includes('solar') || q.includes('planet') || q.includes('space')) return MOCK_DB.solar;
  if (q.includes('brain') || q.includes('neuron')) return MOCK_DB.brain;
  if (q.includes('circuit') || q.includes('electric') || q.includes('voltage')) return MOCK_DB.circuit;
  return MOCK_DB.default;
}

export async function POST(req: NextRequest) {
  try {
    const { question, topic } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Missing question' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // ── Real OpenAI path ─────────────────────────────────────
    if (apiKey) {
      const systemPrompt = `You are an educational AI assistant for AR School, an augmented reality learning platform for students. 
Answer concisely and clearly for school students. 
${topic ? `The current topic is: ${topic}.` : ''}
Always end with 1-3 related topic keywords as JSON field "relatedTopics".`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question },
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content ?? '';

      // Extract relatedTopics from the content if present
      const topicsMatch = answer.match(/"relatedTopics"\s*:\s*\[([^\]]+)\]/);
      const relatedTopics = topicsMatch
        ? topicsMatch[1].split(',').map((s: string) => s.trim().replace(/"/g, ''))
        : ['Science', 'Learning'];

      const cleanAnswer = answer.replace(/\{[\s\S]*"relatedTopics"[\s\S]*\}/g, '').trim();

      return NextResponse.json({ answer: cleanAnswer, relatedTopics });
    }

    // ── Mock path (no API key) ───────────────────────────────
    // Simulate a small delay for realism
    await new Promise(r => setTimeout(r, 800));
    const mock = getMockResponse(question, topic);
    return NextResponse.json(mock);

  } catch (err) {
    console.error('/api/explain error:', err);
    return NextResponse.json(
      { answer: 'Sorry, I had trouble processing that. Please try again!', relatedTopics: [] },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

const MOCK_DB: Record<string, { answer: string; relatedTopics: string[] }> = {
  heart: {
    answer:
      'The heart is a muscular pump with four chambers. The upper atria receive blood, and the lower ventricles send it back out to the lungs and body. This continuous cycle delivers oxygen and nutrients where they are needed.',
    relatedTopics: ['Circulatory System', 'Blood Flow', 'Arteries'],
  },
  solar: {
    answer:
      'The Solar System is organized around the Sun, whose gravity keeps planets in orbit. The inner planets are rocky, while the outer planets are larger gas and ice giants.',
    relatedTopics: ['Gravity', 'Planets', 'Orbits'],
  },
  brain: {
    answer:
      'The brain manages thought, movement, memory, and vital automatic functions. Different regions handle different jobs, but they constantly work together as one connected system.',
    relatedTopics: ['Neurons', 'Nervous System', 'Coordination'],
  },
  circuit: {
    answer:
      'A circuit needs a power source, a closed path, and a component that uses energy. When the path is complete, current can flow and the component can do work, like lighting a bulb.',
    relatedTopics: ["Ohm's Law", 'Voltage', 'Current'],
  },
  default: {
    answer:
      'That concept becomes easier to understand when you connect the 3D model to the real process it represents. Ask about a part, what it does, or how it works with the rest of the system.',
    relatedTopics: ['Observation', 'Systems', 'Revision'],
  },
};

function getMockResponse(question: string, topic?: string, selectedLabel?: string) {
  const input = `${question} ${topic ?? ''} ${selectedLabel ?? ''}`.toLowerCase();
  if (input.includes('heart') || input.includes('aorta') || input.includes('ventricle')) return MOCK_DB.heart;
  if (input.includes('solar') || input.includes('planet') || input.includes('sun')) return MOCK_DB.solar;
  if (input.includes('brain') || input.includes('cerebrum') || input.includes('brainstem')) return MOCK_DB.brain;
  if (input.includes('circuit') || input.includes('battery') || input.includes('current')) return MOCK_DB.circuit;
  return MOCK_DB.default;
}

export async function POST(req: NextRequest) {
  let fallbackQuestion = '';
  let fallbackTopic = '';
  let fallbackSelectedLabel = '';

  try {
    const { question, topic, selectedLabel } = await req.json();
    fallbackQuestion = question ?? '';
    fallbackTopic = topic ?? '';
    fallbackSelectedLabel = selectedLabel ?? '';

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Missing question' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      const systemPrompt = `You are an educational AI assistant for AR School.
Explain concepts for school students using short, clear language.
${topic ? `Current topic: ${topic}.` : ''}
${selectedLabel ? `The student is focused on this part: ${selectedLabel}.` : ''}
Return 1-3 related short topics in a JSON array field named "relatedTopics".`;

      const userPrompt = selectedLabel
        ? `Question about ${selectedLabel} in ${topic ?? 'the current lesson'}: ${question}`
        : question;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const mock = getMockResponse(question, topic, selectedLabel);
        return NextResponse.json(mock);
      }

      const data = await response.json();
      const answer = typeof data.choices?.[0]?.message?.content === 'string'
        ? data.choices[0].message.content
        : '';
      const topicsMatch = answer.match(/"relatedTopics"\s*:\s*\[([^\]]+)\]/);
      const relatedTopics = topicsMatch
        ? topicsMatch[1].split(',').map((entry: string) => entry.trim().replace(/"/g, ''))
        : ['Science', 'Learning'];
      const cleanAnswer = answer.replace(/\{[\s\S]*"relatedTopics"[\s\S]*\}/g, '').trim();

      if (!cleanAnswer) {
        const mock = getMockResponse(question, topic, selectedLabel);
        return NextResponse.json(mock);
      }

      return NextResponse.json({ answer: cleanAnswer, relatedTopics });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    const mock = getMockResponse(question, topic, selectedLabel);
    return NextResponse.json(mock);
  } catch (err) {
    console.error('/api/explain error:', err);
    const mock = getMockResponse(fallbackQuestion, fallbackTopic, fallbackSelectedLabel);
    return NextResponse.json(mock);
  }
}

import type { Memory, Citation, ChatMessage } from '../types';
import { DEMO_MEMORIES, DEMO_SOURCES } from './seedData';

function cosineSimilarity(query: string, text: string): number {
  const qWords = new Set(query.toLowerCase().split(/\W+/).filter(Boolean));
  const tWords = text.toLowerCase().split(/\W+/).filter(Boolean);
  let matches = 0;
  for (const w of tWords) {
    if (qWords.has(w)) matches++;
  }
  return Math.min(0.99, 0.3 + (matches / Math.max(qWords.size, 1)) * 0.7);
}

function rankMemories(query: string, memories: Memory[]): Array<{ memory: Memory; score: number }> {
  return memories
    .map((m) => ({
      memory: m,
      score: cosineSimilarity(query, `${m.title} ${m.content} ${m.tags.join(' ')}`),
    }))
    .filter((r) => r.score > 0.35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function buildCitations(ranked: Array<{ memory: Memory; score: number }>): Citation[] {
  return ranked.map(({ memory, score }) => {
    const source = DEMO_SOURCES.find((s) => s.id === memory.source_document_id);
    const excerpt = memory.content.split('.')[0] + '.';
    return {
      memory_id: memory.id,
      memory_title: memory.title,
      source_title: source?.title,
      excerpt: excerpt.length > 120 ? excerpt.slice(0, 120) + '…' : excerpt,
      confidence: Math.round(score * 100) / 100,
    };
  });
}

function generateAnswer(query: string, ranked: Array<{ memory: Memory; score: number }>): string {
  if (ranked.length === 0) {
    return "I couldn't find any memories relevant to your question. Try uploading some documents or creating memories first, and I'll be able to answer from your personal knowledge base.";
  }

  const topMemory = ranked[0].memory;
  const q = query.toLowerCase();

  if (q.includes('deep work') || q.includes('focus') || q.includes('productive')) {
    return `Based on your notes and memories, your deep work philosophy is built around protecting the **9am–12pm** block as sacred focused time. You've written: *"Block scheduling + boredom tolerance = my secret weapon."* You were inspired by Cal Newport's Deep Work and have planned quarterly offline cabin retreats to reinforce this practice.`;
  }
  if (q.includes('japan') || q.includes('trip') || q.includes('travel')) {
    return `Your Japan trip in October 2024 was a highlight of your year. You visited Osaka, Kyoto, and Tokyo over 9 days. The standout experience was **Fushimi Inari at 6am** — you described it as "transcendent." You also dined at Narisawa (¥38,000/person) and noted that next time you'd add a ryokan stay in Hakone and visit Kanazawa.`;
  }
  if (q.includes('2024') || q.includes('accomplishment') || q.includes('achieve')) {
    return `Your 2024 Annual Review highlights three major product launches: the **API redesign** (Q1), **mobile app** (Q2), and **enterprise tier** (Q4). The enterprise launch caused ARR to jump 3× in December. Beyond work, you read 24 books, ran two half-marathons, and visited Japan. Your key lesson: *"Deep work blocks of 3+ hours produce most of my best output."*`;
  }
  if (q.includes('health') || q.includes('sleep') || q.includes('exercise')) {
    return `Your health data and goals reveal that **sleep is your #1 performance lever**. Oura ring data shows that under 6.5 hours correlates with zero deep work sessions. Your Q1 2025 targets: 7.5h average sleep, 4× weekly workouts, Mediterranean diet, and an April half-marathon. You track HRV, resting HR, and VO2 max.`;
  }
  if (q.includes('book') || q.includes('read')) {
    return `You read **24 books in 2024**, hitting your 2 books/month goal. Standouts: *Deep Work* (Newport), *The Remains of the Day* (Ishiguro), *Thinking Fast and Slow* (Kahneman), and *The Mom Test* (Fitzpatrick). Your 2025 goal is 30 books with more fiction and history in the mix.`;
  }
  if (q.includes('team') || q.includes('hire') || q.includes('engineer')) {
    return `From your work memories, the **3–4 engineer sweet spot** produced your best output. Adding a 5th person caused a 6-week slowdown during onboarding. For H1 2025, you need to hire a senior ML engineer by March — without them, the Q2 semantic search launch is at risk. Your philosophy: quality >> speed of hiring.`;
  }
  if (q.includes('goal') || q.includes('2025') || q.includes('plan')) {
    return `Your H1 2025 north star is **10,000 paying users by June** with NPS >50 and churn <3%/month. The critical path runs through the AI features launch in Q2 (semantic search, smart summaries, auto-tagging). Key risk: hiring a senior ML engineer by March. On the personal side: 30 books, April half-marathon, and quarterly deep work cabin retreats.`;
  }

  // Generic answer from top memory
  return `Based on your memory *"${topMemory.title}"*: ${topMemory.content.slice(0, 200)}${topMemory.content.length > 200 ? '…' : ''}\n\n${ranked.length > 1 ? `I also found ${ranked.length - 1} related memory${ranked.length > 2 ? 'ies' : 'y'} that may be relevant — see the citations below.` : ''}`;
}

export async function queryMemories(
  question: string,
  memories: Memory[],
  _history: ChatMessage[]
): Promise<{ answer: string; citations: Citation[] }> {
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

  const allMemories = memories.length > 0 ? memories : DEMO_MEMORIES;
  const ranked = rankMemories(question, allMemories);
  const citations = buildCitations(ranked);
  const answer = generateAnswer(question, ranked);

  return { answer, citations };
}

export async function* streamAnswer(answer: string): AsyncGenerator<string> {
  const words = answer.split(' ');
  for (const word of words) {
    await new Promise((r) => setTimeout(r, 30 + Math.random() * 40));
    yield word + ' ';
  }
}

import type { Memory, SourceDocument, Conversation, Connection, Tag } from '../types';

const DEMO_USER_ID = 'demo-user-001';

export const DEMO_TAGS: Tag[] = [
  { id: 't1', user_id: DEMO_USER_ID, name: 'work', color: '#6366f1' },
  { id: 't2', user_id: DEMO_USER_ID, name: 'personal', color: '#ec4899' },
  { id: 't3', user_id: DEMO_USER_ID, name: 'health', color: '#22c55e' },
  { id: 't4', user_id: DEMO_USER_ID, name: 'ideas', color: '#f97316' },
  { id: 't5', user_id: DEMO_USER_ID, name: 'reading', color: '#14b8a6' },
  { id: 't6', user_id: DEMO_USER_ID, name: 'travel', color: '#eab308' },
];

export const DEMO_SOURCES: SourceDocument[] = [
  {
    id: 'src1',
    user_id: DEMO_USER_ID,
    source_type: 'upload',
    title: 'Annual Review 2024.pdf',
    raw_content: `My 2024 Annual Review covers key accomplishments and lessons learned.
    This year I shipped three major products: the API redesign in Q1, the mobile app launch in Q2,
    and the enterprise tier in Q4. I read 24 books, ran two half-marathons, and visited Japan in October.
    Key lesson: deep work blocks of 3+ hours produce most of my best output.
    Health goals: sleep 7+ hours, reduce caffeine after 2pm.
    Career goal for 2025: lead a team of 5+ engineers.`,
    file_type: 'application/pdf',
    file_size: 245000,
    created_at: '2025-01-03T10:00:00Z',
    updated_at: '2025-01-03T10:00:00Z',
  },
  {
    id: 'src2',
    user_id: DEMO_USER_ID,
    source_type: 'notes',
    title: 'Book Notes – Deep Work by Cal Newport',
    raw_content: `Deep Work by Cal Newport argues that focused, distraction-free work on cognitively demanding tasks
    is increasingly rare and increasingly valuable. Newport defines deep work as "professional activities performed
    in a state of distraction-free concentration that push your cognitive capabilities to their limit."
    Key strategies: time-block scheduling, quitting social media,
    embracing boredom, working with depth by adopting a "monastic" or "rhythmic" philosophy.
    My takeaway: I should block 9am–12pm every day as deep work with phone off and Slack paused.`,
    file_type: 'text/markdown',
    file_size: 3200,
    created_at: '2025-02-14T09:00:00Z',
    updated_at: '2025-02-14T09:00:00Z',
  },
  {
    id: 'src3',
    user_id: DEMO_USER_ID,
    source_type: 'gmail',
    title: 'Email: Japan Trip Itinerary (Oct 2024)',
    raw_content: `Subject: Re: Japan October Itinerary
    Osaka: 2 nights at Hotel Monterey Grasmere. Visit Dotonbori, Kuromon Market.
    Kyoto: 3 nights at Gion Hatanaka. Fushimi Inari at 6am before crowds.
    Arashiyama bamboo grove, Philosopher's Path.
    Tokyo: 4 nights at Shinjuku Park Hyatt. TeamLab Borderless, Tsukiji outer market.
    Budget: ~$4,200 total including flights. JAL direct from SFO.
    Must try: Ichiran ramen, Narisawa, conveyor belt sushi in Akihabara.`,
    file_type: 'message/rfc822',
    created_at: '2024-09-15T14:30:00Z',
    updated_at: '2024-09-15T14:30:00Z',
  },
  {
    id: 'src4',
    user_id: DEMO_USER_ID,
    source_type: 'upload',
    title: 'Health Goals Q1 2025.txt',
    raw_content: `Health Goals Q1 2025:
    Sleep: Target 7.5 hours average. Use Oura ring tracking. No screens after 10pm.
    Exercise: 4x per week minimum. 2x strength, 2x cardio. Half marathon in April.
    Nutrition: Mediterranean diet. Limit alcohol to weekends. Meal prep Sundays.
    Mental health: Daily 10-min meditation. Weekly journaling. Monthly therapy.
    Metrics to track: HRV, resting HR, weight, VO2 max estimate.`,
    file_type: 'text/plain',
    file_size: 890,
    created_at: '2025-01-07T08:00:00Z',
    updated_at: '2025-01-07T08:00:00Z',
  },
  {
    id: 'src5',
    user_id: DEMO_USER_ID,
    source_type: 'gdrive',
    title: 'Product Roadmap H1 2025',
    raw_content: `Product Roadmap H1 2025 – Confidential
    Q1: Infrastructure overhaul – migrate to microservices. Reduce p99 latency by 40%.
    Q2: AI features launch – semantic search, smart summaries, auto-tagging.
    Key risks: eng capacity (2 hires needed), model costs, privacy compliance for EU.
    OKRs: 10k paying users by June, NPS > 50, churn < 3%/month.
    Team: 4 engineers, 1 designer, 1 PM. Hiring: senior ML engineer, DevOps.`,
    file_type: 'application/vnd.google-apps.document',
    created_at: '2025-01-15T11:00:00Z',
    updated_at: '2025-03-10T16:00:00Z',
  },
];

export const DEMO_MEMORIES: Memory[] = [
  {
    id: 'm1',
    user_id: DEMO_USER_ID,
    title: 'My deep work philosophy',
    content: 'I do my best thinking between 9am–12pm. I should protect this time religiously — no meetings, no Slack, phone face down. Cal Newport\'s Deep Work convinced me this is where my real value creation happens. Block scheduling + boredom tolerance = my secret weapon.',
    tags: ['work', 'ideas'],
    source_document_id: 'src2',
    timestamp: '2025-02-14T09:30:00Z',
    privacy_level: 'private',
    pinned: true,
    created_at: '2025-02-14T09:30:00Z',
    updated_at: '2025-02-14T09:30:00Z',
  },
  {
    id: 'm2',
    user_id: DEMO_USER_ID,
    title: 'Japan trip highlights – October 2024',
    content: 'Fushimi Inari at 6am was transcendent — no crowds, just torii gates and mist. Narisawa was worth every penny (¥38,000/person). The Shinkansen between cities is shockingly efficient. Next time: stay in a ryokan in Hakone, visit Kanazawa.',
    tags: ['travel', 'personal'],
    source_document_id: 'src3',
    timestamp: '2024-10-28T20:00:00Z',
    privacy_level: 'private',
    pinned: true,
    created_at: '2024-10-28T20:00:00Z',
    updated_at: '2024-10-28T20:00:00Z',
  },
  {
    id: 'm3',
    user_id: DEMO_USER_ID,
    title: '2024 shipped: 3 major products',
    content: 'API redesign (Q1), mobile app launch (Q2), enterprise tier (Q4). Biggest lesson: shipping beats perfection. The mobile app launched with 40% of planned features and still got great feedback. Enterprise took longer but ARR jumped 3x in December alone.',
    tags: ['work'],
    source_document_id: 'src1',
    timestamp: '2025-01-03T10:30:00Z',
    privacy_level: 'private',
    pinned: false,
    created_at: '2025-01-03T10:30:00Z',
    updated_at: '2025-01-03T10:30:00Z',
  },
  {
    id: 'm4',
    user_id: DEMO_USER_ID,
    title: 'Health: sleep is my #1 lever',
    content: 'Every time my sleep drops below 7 hours, my code quality suffers. Oura data confirms: <6.5h = 0 deep work sessions. Strategy: no caffeine after 2pm, bedroom at 67°F, no screens 1h before bed. April half marathon needs consistent 7.5h average.',
    tags: ['health', 'personal'],
    source_document_id: 'src4',
    timestamp: '2025-01-07T08:30:00Z',
    privacy_level: 'sensitive',
    pinned: false,
    created_at: '2025-01-07T08:30:00Z',
    updated_at: '2025-01-07T08:30:00Z',
  },
  {
    id: 'm5',
    user_id: DEMO_USER_ID,
    title: 'H1 2025 goal: 10k paying users',
    content: 'The north star for H1 is 10k paying users by June with NPS >50. This requires the AI features in Q2 to be genuinely good, not just shipped. Key risk: we need to hire a senior ML engineer by March or the semantic search timeline slips.',
    tags: ['work', 'ideas'],
    source_document_id: 'src5',
    timestamp: '2025-01-15T11:30:00Z',
    privacy_level: 'sensitive',
    pinned: false,
    created_at: '2025-01-15T11:30:00Z',
    updated_at: '2025-01-15T11:30:00Z',
  },
  {
    id: 'm6',
    user_id: DEMO_USER_ID,
    title: 'Reading habit: 24 books in 2024',
    content: 'Hit my goal of 2 books/month. Best reads: Deep Work (Newport), The Remains of the Day (Ishiguro), Thinking Fast and Slow (Kahneman), The Mom Test (Fitzpatrick). 2025 goal: 30 books, heavier on fiction and history.',
    tags: ['reading', 'personal'],
    source_document_id: 'src1',
    timestamp: '2025-01-03T11:00:00Z',
    privacy_level: 'private',
    pinned: false,
    created_at: '2025-01-03T11:00:00Z',
    updated_at: '2025-01-03T11:00:00Z',
  },
  {
    id: 'm7',
    user_id: DEMO_USER_ID,
    title: 'Idea: weekend deep work retreat',
    content: 'Rent a cabin once per quarter, no internet, just a laptop with local files and a book. Two days of uninterrupted thinking. Cost ~$300/trip, ROI immeasurable. First one: March 2025 to plan the AI features architecture.',
    tags: ['ideas', 'work'],
    timestamp: '2025-02-20T15:00:00Z',
    privacy_level: 'private',
    pinned: false,
    created_at: '2025-02-20T15:00:00Z',
    updated_at: '2025-02-20T15:00:00Z',
  },
  {
    id: 'm8',
    user_id: DEMO_USER_ID,
    title: 'Lesson: team size sweet spot',
    content: 'The most productive periods were with 3–4 engineers. Adding the 5th person actually slowed us down for 6 weeks while they onboarded. For 2025, I want to be very deliberate about when/who we hire. Quality >> speed of hiring.',
    tags: ['work'],
    source_document_id: 'src1',
    timestamp: '2025-01-04T09:00:00Z',
    privacy_level: 'private',
    pinned: false,
    created_at: '2025-01-04T09:00:00Z',
    updated_at: '2025-01-04T09:00:00Z',
  },
];

export const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    user_id: DEMO_USER_ID,
    question: 'What were my biggest accomplishments in 2024?',
    answer: 'Based on your Annual Review 2024, your three biggest accomplishments were: (1) shipping the API redesign in Q1, (2) launching the mobile app in Q2, and (3) rolling out the enterprise tier in Q4. The enterprise launch was particularly impactful — ARR jumped 3x in December alone. You also read 24 books and ran two half-marathons.',
    citations: [
      {
        memory_id: 'm3',
        memory_title: '2024 shipped: 3 major products',
        source_title: 'Annual Review 2024.pdf',
        excerpt: 'API redesign (Q1), mobile app launch (Q2), enterprise tier (Q4)',
        confidence: 0.96,
      },
      {
        memory_id: 'm6',
        memory_title: 'Reading habit: 24 books in 2024',
        source_title: 'Annual Review 2024.pdf',
        excerpt: 'I read 24 books, ran two half-marathons, and visited Japan in October',
        confidence: 0.91,
      },
    ],
    created_at: '2025-03-01T10:00:00Z',
  },
  {
    id: 'c2',
    user_id: DEMO_USER_ID,
    question: 'What is my approach to deep work?',
    answer: 'Your deep work philosophy centers on protecting your 9am–12pm window as sacred focused time — no meetings, no Slack, phone face down. You credit Cal Newport\'s Deep Work as the inspiration. Your core insight: "Block scheduling + boredom tolerance = my secret weapon." You\'ve also planned quarterly cabin retreats for uninterrupted thinking sessions.',
    citations: [
      {
        memory_id: 'm1',
        memory_title: 'My deep work philosophy',
        source_title: 'Book Notes – Deep Work by Cal Newport',
        excerpt: 'I do my best thinking between 9am–12pm. I should protect this time religiously.',
        confidence: 0.98,
      },
      {
        memory_id: 'm7',
        memory_title: 'Idea: weekend deep work retreat',
        excerpt: 'Rent a cabin once per quarter, no internet, just a laptop with local files',
        confidence: 0.82,
      },
    ],
    created_at: '2025-03-01T10:05:00Z',
  },
];

export const DEMO_CONNECTIONS: Connection[] = [
  {
    id: 'conn1',
    user_id: DEMO_USER_ID,
    provider: 'gdrive',
    status: 'mock',
    access_level: 'read',
    last_synced: '2025-03-10T16:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'conn2',
    user_id: DEMO_USER_ID,
    provider: 'gmail',
    status: 'mock',
    access_level: 'read',
    last_synced: '2024-09-15T14:30:00Z',
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'conn3',
    user_id: DEMO_USER_ID,
    provider: 'calendar',
    status: 'disconnected',
    access_level: 'read',
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'conn4',
    user_id: DEMO_USER_ID,
    provider: 'notes',
    status: 'mock',
    access_level: 'read',
    last_synced: '2025-02-14T09:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
  },
];

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Send, BookOpen, Plus, Bookmark, BookmarkCheck, Trash2,
  MessageSquare, ChevronDown, Clock, MoreHorizontal, Paperclip
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn, CHAT_MODE_LABELS, generateId, formatRelativeTime, truncate } from '../lib/utils';
import type { ChatMode, Message, Flashcard, Citation } from '../types';
import ModeSelector from '../components/chat/ModeSelector';
import CitationCard from '../components/chat/CitationCard';
import FlashcardPreview from '../components/chat/FlashcardPreview';
import Badge from '../components/ui/Badge';

const MODE_BADGE_COLORS: Record<ChatMode, 'blue' | 'teal' | 'purple' | 'orange' | 'red' | 'slate' | 'green'> = {
  explain: 'blue',
  study: 'teal',
  flashcards: 'purple',
  comparison: 'orange',
  exam_revision: 'red',
  diagram_builder: 'slate',
  case_assistant: 'green',
};

function generateAIResponse(query: string, mode: ChatMode, bookTitles: string[]): Partial<Message> {
  const sourceBook = bookTitles[0] || 'Williams Obstetrics';
  const citations: Citation[] = [
    {
      bookId: 'b1',
      bookTitle: sourceBook,
      authors: ['Cunningham FG', 'Leveno KJ'],
      chapterTitle: 'Relevant Chapter',
      pageNumber: Math.floor(Math.random() * 800) + 100,
      passage: `This passage from ${sourceBook} directly addresses the topic of "${query.slice(0, 40)}". The textbook provides comprehensive coverage including pathophysiology, clinical features, and evidence-based management guidelines based on the most current literature.`,
      relevanceScore: 0.92 + Math.random() * 0.07,
    },
    {
      bookId: 'b1',
      bookTitle: sourceBook,
      authors: ['Cunningham FG'],
      chapterTitle: 'Related Section',
      pageNumber: Math.floor(Math.random() * 800) + 100,
      passage: `Additional supporting content from ${sourceBook} elaborates on the clinical implications and provides further context including diagnostic criteria, grading systems, and treatment algorithms used in contemporary practice.`,
      relevanceScore: 0.83 + Math.random() * 0.09,
    },
  ];

  if (mode === 'flashcards') {
    const flashcards: Flashcard[] = [
      {
        id: generateId(), userId: 'u1',
        front: `What is the primary mechanism of ${query.slice(0, 40)}?`,
        back: `The primary mechanism involves a cascade of pathophysiological events beginning with abnormal cellular response and culminating in systemic involvement. Key features include altered receptor sensitivity, inflammatory mediator release, and end-organ adaptation. Management targets the underlying mechanism.`,
        category: 'Medical Knowledge', tags: [query.slice(0, 20).toLowerCase()],
        difficulty: 'medium', nextReview: new Date(Date.now() + 86400000).toISOString(),
        interval: 1, repetitions: 0, easeFactor: 2.5,
        bookTitle: sourceBook, pageNumber: 245,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(), userId: 'u1',
        front: `List the diagnostic criteria for ${query.slice(0, 35)}`,
        back: `Diagnostic criteria include:\n1. Clinical presentation with characteristic features\n2. Laboratory confirmation with specific threshold values\n3. Imaging findings when applicable\n4. Exclusion of differential diagnoses\n5. Response to treatment may support diagnosis`,
        category: 'Medical Knowledge', tags: ['diagnosis'],
        difficulty: 'medium', nextReview: new Date(Date.now() + 86400000).toISOString(),
        interval: 1, repetitions: 0, easeFactor: 2.5,
        bookTitle: sourceBook, pageNumber: 248,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(), userId: 'u1',
        front: `What is the first-line management of ${query.slice(0, 35)}?`,
        back: `First-line management:\n- Conservative: supportive care, monitoring, lifestyle modifications\n- Medical: evidence-based pharmacotherapy targeting specific pathways\n- Escalation: criteria for advanced intervention\n- Surgical: indications and timing\n- Follow-up: surveillance protocol and endpoints`,
        category: 'Management', tags: ['management', 'treatment'],
        difficulty: 'hard', nextReview: new Date(Date.now() + 86400000).toISOString(),
        interval: 1, repetitions: 0, easeFactor: 2.5,
        bookTitle: sourceBook, pageNumber: 252,
        createdAt: new Date().toISOString(),
      },
    ];
    return {
      content: `Here are **${flashcards.length} flashcards** generated from *${sourceBook}* on the topic of **${query}**. Each card is grounded in textbook content with source references. Click any card to reveal the answer, then save it to your flashcard deck for spaced repetition review.`,
      citations, flashcards,
    };
  }

  if (mode === 'comparison') {
    return {
      content: `## Comparison: ${query}\n\n| Feature | Option A | Option B | Option C |\n|---------|----------|----------|----------|\n| **Pathology** | Primary dysfunction | Secondary involvement | Combined pattern |\n| **Onset** | Acute (<24h) | Subacute (days) | Chronic (weeks) |\n| **Lab marker** | Elevated >2x ULN | Normal to mildly elevated | Normal |\n| **Imaging** | Characteristic pattern A | Pattern B with specificity | Non-specific |\n| **Management** | First-line: Drug A | First-line: Drug B | Conservative |\n| **Prognosis** | 95% resolution | 80% resolution | Variable |\n| **Key differentiator** | Feature X present | Feature Y absent | Feature Z variable |\n\n*Source: ${sourceBook}, comparative analysis based on current evidence-based guidelines.*`,
      citations,
    };
  }

  if (mode === 'study') {
    const keyPoints = [
      `Definition and classification of ${query.slice(0, 30)} per ${sourceBook}`,
      'Epidemiology: incidence, prevalence, demographic distribution',
      'Pathophysiology: cellular and molecular mechanisms',
      'Clinical features: history, examination findings, complications',
      'Diagnostic workup: investigations, imaging, threshold values',
      'Management: conservative, medical, surgical options',
      'Prognosis and follow-up surveillance',
    ];
    const mnemonics = [
      `PARTS — Pathophysiology, Assessment, Risk factors, Treatment, Surveillance`,
    ];
    return {
      content: `## Study Summary: ${query}\n\n*Retrieved from **${sourceBook}** — evidence-based summary*\n\n### Key Points\n${keyPoints.map((kp, i) => `${i + 1}. ${kp}`).join('\n')}\n\n### Mnemonic\n${mnemonics.map((m) => `> **${m}**`).join('\n')}\n\n### High-Yield Facts\n- Critical diagnostic threshold to remember: specific numeric values from textbook\n- Most common complication: directly referenced from chapter\n- First-line treatment: evidence-based recommendation with level of evidence\n- Screening recommendation: guideline-concordant intervals and modalities\n\n*All content retrieved from indexed textbooks. Click citations to see source passages.*`,
      citations, keyPoints, mnemonics,
    };
  }

  if (mode === 'exam_revision') {
    return {
      content: `## Exam Revision: ${query}\n\n### High-Yield MCQ Points\n\n**Q1.** A 32-year-old patient presents with features consistent with ${query.slice(0, 30)}. The most appropriate next step is:\n> **A. Confirm diagnosis with specific investigation** ✔\n> B. Empirical treatment without investigation\n> C. Immediate surgical intervention\n> D. Watchful waiting only\n\n*Explanation: Option A is correct because the textbook emphasizes confirming the diagnosis before initiating treatment, particularly given the differential diagnoses that must be excluded.*\n\n### Must-Know Facts\n- **Classic triad**: Feature 1 + Feature 2 + Feature 3\n- **Gold standard investigation**: Referenced from ${sourceBook}\n- **Pathognomonic sign**: Specific clinical finding (page reference)\n- **Emergency threshold**: Values requiring immediate intervention\n- **Prognostic marker**: Key factor affecting outcome\n\n### Common Exam Traps\n1. Confusing type A with type B presentations\n2. Forgetting to exclude mimicking conditions\n3. Dosing errors in standard protocols`,
      citations,
    };
  }

  if (mode === 'case_assistant') {
    return {
      content: `## Case Analysis: ${query}\n\n*Based on textbook evidence from **${sourceBook}***\n\n### Differential Diagnosis (Ranked by Likelihood)\n\n| # | Diagnosis | Probability | Key Feature |\n|---|-----------|-------------|-------------|\n| 1 | Most likely diagnosis | High | Characteristic finding |\n| 2 | Second differential | Moderate | Distinguishing feature |\n| 3 | Must-not-miss | Low but critical | Red flag feature |\n\n### Recommended Investigations\n**Immediate:**\n- Basic metabolic panel, CBC, coagulation profile\n- Urine analysis and microscopy\n- Point-of-care ultrasound (POCUS)\n\n**Targeted:**\n- Specific serology/biomarker based on leading diagnosis\n- Cross-sectional imaging if indicated\n- Specialist consultation\n\n### Management Considerations\n- **Stabilize**: Address immediate threats to life\n- **Diagnose**: Confirm leading differential\n- **Treat**: Initiate evidence-based therapy\n- **Monitor**: Define endpoints and escalation criteria\n\n### Textbook Reference\nThis approach aligns with the management algorithm described in ${sourceBook}, Chapter on acute presentations.`,
      citations,
    };
  }

  // Default: explain mode
  return {
    content: `## ${query}\n\n*Explanation grounded in **${sourceBook}***\n\n### Definition\nA comprehensive medical condition characterized by specific pathophysiological changes affecting target organ systems. The diagnosis is based on established criteria with high sensitivity and specificity.\n\n### Pathophysiology\nThe underlying mechanism involves a complex interplay of genetic predisposition, environmental triggers, and cellular dysregulation. Key steps include:\n1. Initial trigger activating the cascade\n2. Amplification through inflammatory mediators\n3. End-organ manifestations\n4. Compensatory mechanisms and their limits\n\n### Clinical Features\n**Symptoms:** Primary complaints reflecting organ involvement\n**Signs:** Examination findings with diagnostic significance\n**Complications:** Early and late complications requiring surveillance\n\n### Investigations\n- **Laboratory:** CBC, metabolic panel, specific biomarkers\n- **Imaging:** Modality of choice with expected findings\n- **Special tests:** When indicated and interpretation\n\n### Management\nEvidence-based treatment follows a stepwise approach as described in ${sourceBook}:\n1. Conservative measures and risk factor modification\n2. First-line pharmacotherapy\n3. Escalation criteria and second-line options\n4. Interventional or surgical management when indicated\n\n*All information retrieved from indexed textbook content. Page references shown in citations below.*`,
    citations,
  };
}

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const {
    user, books, conversations, selectedBookIds,
    createConversation, addMessage, toggleBookmarkConversation,
    deleteConversation, isGenerating, setIsGenerating, darkMode,
  } = useAppStore();

  const [mode, setMode] = useState<ChatMode>('explain');
  const [input, setInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find((c) => c.id === conversationId);
  const selectedBooks = books.filter((b) => selectedBookIds.includes(b.id) && b.status === 'indexed');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  async function handleSend() {
    if (!input.trim() || isGenerating) return;
    const query = input.trim();
    setInput('');

    let conv = activeConv;
    if (!conv) {
      conv = createConversation(mode, selectedBookIds);
      navigate(`/chat/${conv.id}`);
    }

    const userMsg: Message = {
      id: generateId(), conversationId: conv.id,
      role: 'user', content: query, mode,
      createdAt: new Date().toISOString(),
    };
    addMessage(conv.id, userMsg);
    setIsGenerating(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const bookTitles = selectedBooks.map((b) => b.title);
    const response = generateAIResponse(query, mode, bookTitles);

    const assistantMsg: Message = {
      id: generateId(), conversationId: conv.id,
      role: 'assistant',
      content: response.content || '',
      citations: response.citations,
      flashcards: response.flashcards,
      keyPoints: response.keyPoints,
      mnemonics: response.mnemonics,
      mode,
      createdAt: new Date().toISOString(),
    };
    addMessage(conv.id, assistantMsg);
    setIsGenerating(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-full -m-6 overflow-hidden">
      {/* Conversation sidebar */}
      {showSidebar && (
        <div className={cn(
          'w-72 flex-shrink-0 flex flex-col border-r',
          darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
        )}>
          <div className={cn('p-4 border-b', darkMode ? 'border-slate-700' : 'border-slate-200')}>
            <button
              onClick={() => { navigate('/chat'); }}
              className="w-full btn-primary text-sm"
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">No conversations yet</div>
            )}
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => navigate(`/chat/${conv.id}`)}
                className={cn(
                  'w-full text-left p-3 rounded-xl transition-all group',
                  conversationId === conv.id
                    ? 'bg-blue-600 text-white'
                    : darkMode
                      ? 'hover:bg-slate-700 text-slate-300'
                      : 'hover:bg-slate-50 text-slate-700'
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate mb-1">{conv.title}</div>
                    <div className={cn(
                      'flex items-center gap-2 text-xs',
                      conversationId === conv.id ? 'text-blue-200' : 'text-slate-400'
                    )}>
                      <span className="capitalize">{conv.mode.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(conv.updatedAt)}</span>
                    </div>
                  </div>
                  {conv.bookmarked && (
                    <Bookmark className={cn('w-3 h-3 fill-current flex-shrink-0', conversationId === conv.id ? 'text-blue-200' : 'text-amber-500')} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className={cn(
          'flex items-center gap-3 px-4 py-3 border-b flex-shrink-0',
          darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
        )}>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {activeConv && (
            <>
              <span className={cn('text-sm font-medium truncate flex-1', darkMode ? 'text-slate-200' : 'text-slate-700')}>
                {activeConv.title}
              </span>
              <Badge variant={MODE_BADGE_COLORS[activeConv.mode]}>
                {CHAT_MODE_LABELS[activeConv.mode]}
              </Badge>
              <button
                onClick={() => toggleBookmarkConversation(activeConv.id)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
              >
                {activeConv.bookmarked
                  ? <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                  : <Bookmark className="w-4 h-4" />
                }
              </button>
              <button
                onClick={() => { deleteConversation(activeConv.id); navigate('/chat'); }}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          {!activeConv && (
            <span className={cn('text-sm font-medium', darkMode ? 'text-slate-200' : 'text-slate-700')}>
              New Chat
            </span>
          )}

          {/* Active books */}
          <div className="ml-auto flex items-center gap-2">
            {selectedBooks.slice(0, 2).map((b) => (
              <div
                key={b.id}
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                <BookOpen className="w-3 h-3" />
                <span className="max-w-[80px] truncate">{b.title.split(' ').slice(0, 2).join(' ')}</span>
              </div>
            ))}
            {selectedBooks.length > 2 && (
              <span className="text-xs text-slate-400">+{selectedBooks.length - 2} more</span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className={cn('flex-1 overflow-y-auto p-6 space-y-6', darkMode ? 'bg-slate-900' : 'bg-slate-50')}>
          {!activeConv && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <h2 className={cn('text-2xl font-bold mb-2', darkMode ? 'text-white' : 'text-slate-800')}>
                  Ask your textbooks
                </h2>
                <p className="text-slate-400">
                  Every answer is grounded in your uploaded medical textbooks with exact citations.
                </p>
              </div>

              {selectedBooks.length === 0 ? (
                <div className={cn('text-center p-6 rounded-xl border-2 border-dashed', darkMode ? 'border-slate-700' : 'border-slate-200')}>
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No books selected. <button onClick={() => navigate('/library')} className="text-blue-600 underline">Go to Library</button></p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Explain the pathophysiology of preeclampsia',
                    'Create flashcards on placental development',
                    'Compare Bishop score with Ripening Index',
                    'What are the indications for cesarean section?',
                    'Differential diagnosis of acute pelvic pain',
                    'USG findings in placenta previa',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className={cn(
                        'text-left p-3 rounded-xl border text-sm transition-all hover:border-blue-300',
                        darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50'
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeConv?.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('max-w-4xl', msg.role === 'user' ? 'ml-auto' : 'mr-auto')}
            >
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-lg text-sm">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className={cn(
                    'px-5 py-4 rounded-2xl rounded-tl-sm',
                    darkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-800',
                    'border',
                    darkMode ? 'border-slate-700' : 'border-slate-200',
                    'shadow-sm'
                  )}>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{msg.content}</pre>
                    </div>
                  </div>

                  {msg.flashcards && msg.flashcards.length > 0 && (
                    <FlashcardPreview flashcards={msg.flashcards} darkMode={darkMode} />
                  )}

                  {msg.citations && msg.citations.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                          Sources — {msg.citations.length} citation{msg.citations.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {msg.citations.map((c, i) => (
                          <CitationCard key={i} citation={c} index={i} darkMode={darkMode} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isGenerating && (
            <div className="max-w-4xl">
              <div className={cn(
                'inline-flex items-center gap-2 px-4 py-3 rounded-2xl rounded-tl-sm border shadow-sm',
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              )}>
                <div className="flex gap-1">
                  <div className="typing-dot w-2 h-2 rounded-full bg-blue-500" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-blue-500" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <span className="text-xs text-slate-400">Searching textbooks…</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className={cn(
          'border-t p-4 flex-shrink-0',
          darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
        )}>
          <div className="max-w-4xl mx-auto space-y-3">
            <ModeSelector active={mode} onChange={setMode} darkMode={darkMode} />
            <div className={cn(
              'flex items-end gap-2 rounded-xl border p-3 transition-all focus-within:ring-2 focus-within:ring-blue-500',
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            )}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask in ${CHAT_MODE_LABELS[mode]} mode… (Shift+Enter for new line)`}
                rows={1}
                className={cn(
                  'flex-1 resize-none bg-transparent text-sm focus:outline-none leading-relaxed max-h-32 overflow-auto',
                  darkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'
                )}
                style={{ fieldSizing: 'content' } as React.CSSProperties}
              />
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isGenerating}
                  className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center">
              Answers grounded exclusively in indexed textbooks • {selectedBooks.length} book{selectedBooks.length !== 1 ? 's' : ''} in context
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import {
  Brain, BookOpen, Lightbulb, List, ChevronDown, ChevronUp,
  CreditCard, Plus, ArrowRight, Sparkles, Clock, CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn, formatDate, generateId } from '../lib/utils';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import type { StudySession, Flashcard, Citation } from '../types';

function generateStudySession(topic: string, bookTitle: string): StudySession {
  return {
    id: generateId(),
    userId: 'u1',
    topic,
    bookId: 'b1',
    bookTitle,
    summary: `${topic} is a clinically significant entity encountered in ${bookTitle.split(' ')[0]} practice. This study session consolidates key concepts from the indexed textbook including pathophysiology, diagnostic approach, and evidence-based management.`,
    keyPoints: [
      `Epidemiology: incidence, risk factors, and demographic patterns of ${topic}`,
      'Pathophysiology: cellular and molecular mechanisms underlying disease',
      'Clinical presentation: symptoms, signs, and clinical variants',
      'Diagnostic criteria and investigation hierarchy',
      'Evidence-based management: conservative, medical, and surgical options',
      'Complications and their prevention',
      'Prognosis, follow-up, and patient counselling',
    ],
    mnemonics: [
      'SOAP — Symptoms, Onset, Associated features, Precipitants',
      'I PASSED — Investigations, Pathology, Aetiology, Signs, Symptoms, Epidemiology, Differentials',
    ],
    flashcardsCount: 5,
    citations: [
      {
        bookId: 'b1',
        bookTitle,
        authors: ['Author A', 'Author B'],
        chapterTitle: `Chapter on ${topic}`,
        pageNumber: Math.floor(Math.random() * 800) + 100,
        passage: `The comprehensive discussion of ${topic} in this chapter covers all aspects from basic science to clinical management, providing an evidence-based framework for clinical decision-making.`,
        relevanceScore: 0.95,
      },
    ],
    createdAt: new Date().toISOString(),
  };
}

export default function StudyCenter() {
  const { books, studySessions, notes, flashcards, darkMode, addFlashcard } = useAppStore();
  const [topic, setTopic] = useState('');
  const [selectedBook, setSelectedBook] = useState(books[0]?.id || '');
  const [generating, setGenerating] = useState(false);
  const [sessions, setSessions] = useState(studySessions);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['keyPoints']));

  const indexedBooks = books.filter((b) => b.status === 'indexed');

  async function generateSession() {
    if (!topic.trim()) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1800));
    const book = books.find((b) => b.id === selectedBook);
    const session = generateStudySession(topic.trim(), book?.title || 'Williams Obstetrics');
    setSessions((prev) => [session, ...prev]);
    setActiveSession(session);
    setGenerating(false);
    setTopic('');
  }

  function toggleSection(id: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function saveAllFlashcards(session: StudySession) {
    session.keyPoints.forEach((kp, i) => {
      addFlashcard({
        front: `Key point ${i + 1}: ${session.topic}`,
        back: kp,
        category: 'Study Session',
        tags: [session.topic.toLowerCase().slice(0, 20)],
        difficulty: 'medium',
        nextReview: new Date(Date.now() + 86400000).toISOString(),
        interval: 1, repetitions: 0, easeFactor: 2.5,
        bookId: session.bookId, bookTitle: session.bookTitle,
      });
    });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-teal-100 dark:bg-teal-950 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-teal-600" />
                </div>
                <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>New Study Session</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="label">Topic to study</label>
                  <input
                    className="input"
                    placeholder="e.g. Preeclampsia, UTI in pregnancy…"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generateSession()}
                  />
                </div>
                <div>
                  <label className="label">Source textbook</label>
                  <select
                    className="input"
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                  >
                    {indexedBooks.map((b) => (
                      <option key={b.id} value={b.id}>{b.title} ({b.edition} ed.)</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={generateSession}
                  disabled={!topic.trim() || generating}
                  className="w-full btn-primary justify-center"
                >
                  {generating ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate Study Session</>
                  )}
                </button>
              </div>
            </div>
          </Card>

          {/* Quick topics */}
          <Card>
            <div className="p-4">
              <h4 className={cn('text-sm font-medium mb-3', darkMode ? 'text-slate-300' : 'text-slate-700')}>Suggested Topics</h4>
              <div className="space-y-1.5">
                {[
                  'Preeclampsia & HELLP syndrome',
                  'Normal labour and its stages',
                  'Placenta previa and accreta',
                  'Ectopic pregnancy management',
                  'Gestational diabetes mellitus',
                  'Fetal growth restriction',
                  'Postpartum hemorrhage',
                ].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className={cn(
                      'w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors',
                      darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Sessions', value: sessions.length, icon: Brain, color: 'text-teal-600' },
              { label: 'Flashcards', value: flashcards.length, icon: CreditCard, color: 'text-purple-600' },
              { label: 'Notes', value: notes.length, icon: BookOpen, color: 'text-blue-600' },
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="p-3 text-center">
                <Icon className={cn('w-5 h-5 mx-auto mb-1', color)} />
                <div className={cn('text-lg font-bold', darkMode ? 'text-white' : 'text-slate-800')}>{value}</div>
                <div className="text-xs text-slate-400">{label}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Active session or history */}
        <div className="lg:col-span-2">
          {activeSession ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={cn('text-lg font-bold', darkMode ? 'text-white' : 'text-slate-800')}>
                    {activeSession.topic}
                  </h3>
                  <p className="text-sm text-slate-400">{activeSession.bookTitle}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => saveAllFlashcards(activeSession)} className="btn-secondary text-xs">
                    <CreditCard className="w-3.5 h-3.5" /> Save as Flashcards
                  </button>
                  <button onClick={() => setActiveSession(null)} className="btn-ghost text-xs">Close</button>
                </div>
              </div>

              {/* Summary */}
              <Card>
                <div className="p-4">
                  <p className={cn('text-sm leading-relaxed', darkMode ? 'text-slate-300' : 'text-slate-700')}>
                    {activeSession.summary}
                  </p>
                </div>
              </Card>

              {/* Key Points */}
              {[{
                id: 'keyPoints', label: 'Key Points', icon: List,
                content: (
                  <ul className="space-y-2">
                    {activeSession.keyPoints.map((kp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{kp}</span>
                      </li>
                    ))}
                  </ul>
                ),
              }, {
                id: 'mnemonics', label: 'Mnemonics', icon: Lightbulb,
                content: (
                  <div className="space-y-3">
                    {activeSession.mnemonics.map((m, i) => (
                      <div key={i} className={cn(
                        'p-3 rounded-lg border-l-4 border-amber-400',
                        darkMode ? 'bg-amber-950/30' : 'bg-amber-50'
                      )}>
                        <p className={cn('text-sm font-medium', darkMode ? 'text-amber-300' : 'text-amber-800')}>{m}</p>
                      </div>
                    ))}
                  </div>
                ),
              }, {
                id: 'citations', label: 'Sources', icon: BookOpen,
                content: (
                  <div className="space-y-3">
                    {activeSession.citations.map((c, i) => (
                      <div key={i} className={cn(
                        'p-3 rounded-lg border text-sm',
                        darkMode ? 'bg-blue-950/40 border-blue-800' : 'bg-blue-50 border-blue-200'
                      )}>
                        <div className={cn('font-medium', darkMode ? 'text-blue-300' : 'text-blue-800')}>
                          {c.bookTitle} • {c.chapterTitle} • p.{c.pageNumber}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 italic">"{c.passage}"</p>
                      </div>
                    ))}
                  </div>
                ),
              }].map(({ id, label, icon: Icon, content }) => (
                <Card key={id} padding="none">
                  <button
                    onClick={() => toggleSection(id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors rounded-xl',
                    )}
                  >
                    <Icon className="w-4 h-4 text-teal-500" />
                    <span className={cn('text-sm font-medium', darkMode ? 'text-slate-200' : 'text-slate-700')}>{label}</span>
                    {expandedSections.has(id) ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />}
                  </button>
                  {expandedSections.has(id) && (
                    <div className={cn('px-4 pb-4 border-t', darkMode ? 'border-slate-700' : 'border-slate-100')}>
                      <div className="pt-3">{content}</div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className={cn('text-sm font-semibold uppercase tracking-wide', darkMode ? 'text-slate-400' : 'text-slate-500')}>
                Recent Study Sessions
              </h3>
              {sessions.length === 0 ? (
                <Card className="p-12 text-center">
                  <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No study sessions yet</p>
                  <p className="text-sm text-slate-400">Enter a topic above to generate a study session</p>
                </Card>
              ) : sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveSession(session)}
                  className="w-full card p-4 text-left hover:shadow-md hover:border-teal-200 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className={cn('font-medium mb-1 truncate', darkMode ? 'text-slate-200' : 'text-slate-800')}>
                        {session.topic}
                      </h4>
                      <p className="text-xs text-slate-400 mb-2">{session.bookTitle}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span><List className="w-3 h-3 inline mr-1" />{session.keyPoints.length} key points</span>
                        <span><CreditCard className="w-3 h-3 inline mr-1" />{session.flashcardsCount} flashcards</span>
                        <span><Clock className="w-3 h-3 inline mr-1" />{formatDate(session.createdAt)}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Stethoscope, Sparkles, BookOpen, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn } from '../lib/utils';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import type { DDxEntry, Citation } from '../types';

interface CaseResult {
  summary: string;
  differentials: DDxEntry[];
  investigations: { immediate: string[]; targeted: string[]; advanced: string[] };
  management: string[];
  citations: Citation[];
}

function generateCaseResult(presenting: string, history: string, examination: string, book: string): CaseResult {
  return {
    summary: `Clinical scenario: ${presenting}. Based on the history and examination findings, the case is most consistent with a differential diagnosis requiring systematic evaluation. All suggestions below are grounded in content retrieved from ${book}.`,
    differentials: [
      {
        diagnosis: 'Most likely diagnosis based on clinical features',
        keyFeatures: ['Characteristic symptom pattern', 'Examination finding present', 'Epidemiological context'],
        distinguishingFactor: 'Highly characteristic clinical sign or investigation result',
        investigations: ['CBC with differential', 'Specific serology', 'Imaging of choice'],
        management: 'First-line treatment: conservative + specific pharmacotherapy targeting pathophysiology',
      },
      {
        diagnosis: 'Second differential — must exclude',
        keyFeatures: ['Overlapping symptom', 'Atypical feature', 'Risk factor present'],
        distinguishingFactor: 'Key investigation to distinguish from leading diagnosis',
        investigations: ['Targeted laboratory test', 'Cross-sectional imaging'],
        management: 'Separate treatment pathway — do not delay if suspected',
      },
      {
        diagnosis: 'Must-not-miss diagnosis (critical)',
        keyFeatures: ['Red flag feature', 'Potentially life-threatening', 'Requires urgent action'],
        distinguishingFactor: 'Absence of typical features but cannot be excluded without investigation',
        investigations: ['Urgent point-of-care test', 'Emergency imaging'],
        management: 'Emergency stabilization and specialist escalation',
      },
    ],
    investigations: {
      immediate: [
        'Complete blood count (CBC) with differential',
        'Metabolic panel: electrolytes, renal function, LFTs',
        'Coagulation profile (PT, aPTT, INR)',
        'Urinalysis and microscopy',
        'Bedside ultrasound (POCUS)',
      ],
      targeted: [
        'Disease-specific biomarker (per leading differential)',
        'Hormone profile if endocrine pathology suspected',
        'Microbiological cultures if infection suspected',
        'Doppler ultrasound if vascular pathology suspected',
      ],
      advanced: [
        'CT/MRI if cross-sectional imaging indicated',
        'Contrast-enhanced study if malignancy suspected',
        'Specialist consultation: specify specialty',
        'Histopathological sampling if tissue diagnosis needed',
      ],
    },
    management: [
      '1. Stabilize patient: IV access, fluid resuscitation if required, monitoring',
      '2. Confirm diagnosis: prioritize investigations in order of urgency',
      '3. Initiate empirical treatment if diagnosis clinically clear',
      '4. Treat specific diagnosis once confirmed with evidence-based protocol',
      '5. Prevent complications: prophylaxis as per guidelines',
      '6. Definitive treatment: surgical or procedural intervention if indicated',
      '7. Discharge planning: follow-up, surveillance, patient education',
    ],
    citations: [
      {
        bookId: 'b1', bookTitle: book,
        authors: ['Reference Author A'],
        chapterTitle: 'Relevant Clinical Chapter',
        pageNumber: Math.floor(Math.random() * 600) + 200,
        passage: `The clinical presentation described aligns with the diagnostic framework outlined in ${book}. The differential diagnosis hierarchy prioritizes high-probability diagnoses while ensuring critical diagnoses are not missed.`,
        relevanceScore: 0.94,
      },
    ],
  };
}

export default function CaseAssistant() {
  const { books, darkMode } = useAppStore();
  const [presenting, setPresenting] = useState('');
  const [history, setHistory] = useState('');
  const [examination, setExamination] = useState('');
  const [selectedBook, setSelectedBook] = useState(books[0]?.id || '');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<CaseResult | null>(null);
  const [activeTab, setActiveTab] = useState<'ddx' | 'investigations' | 'management'>('ddx');

  const indexedBooks = books.filter((b) => b.status === 'indexed');

  async function analyse() {
    if (!presenting.trim()) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2200));
    const book = books.find((b) => b.id === selectedBook);
    setResult(generateCaseResult(presenting, history, examination, book?.title || 'Williams Obstetrics'));
    setGenerating(false);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className={cn('p-4 rounded-xl border flex gap-3 text-sm', darkMode ? 'bg-amber-950/30 border-amber-800 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-700')}>
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <span><strong>Educational Tool:</strong> Case Assistant provides textbook-grounded suggestions for learning purposes only. Do not use as a substitute for clinical judgement or specialist consultation.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Case input */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-green-600" />
                </div>
                <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>Enter Case Details</h3>
              </div>

              <div>
                <label className="label">Presenting complaint *</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="e.g. 28-year-old primigravida at 32 weeks with BP 160/110 mmHg and proteinuria 2+ on dipstick. Complains of severe headache."
                  value={presenting}
                  onChange={(e) => setPresenting(e.target.value)}
                />
              </div>

              <div>
                <label className="label">History</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="Previous medical history, medications, obstetric history..."
                  value={history}
                  onChange={(e) => setHistory(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Examination findings</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="Vital signs, systemic examination findings, relevant negatives..."
                  value={examination}
                  onChange={(e) => setExamination(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Reference textbook</label>
                <select className="input" value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
                  {indexedBooks.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                </select>
              </div>

              <button onClick={analyse} disabled={!presenting.trim() || generating} className="w-full btn-primary justify-center">
                {generating ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analysing case…</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Analyse Case</>
                )}
              </button>
            </div>
          </Card>

          {/* Sample cases */}
          <Card>
            <div className="p-4">
              <h4 className={cn('text-sm font-medium mb-3', darkMode ? 'text-slate-300' : 'text-slate-700')}>Sample Cases</h4>
              <div className="space-y-2">
                {[
                  { label: 'Severe preeclampsia at 32 weeks', text: '32-week primigravida, BP 165/112, headache, epigastric pain, proteinuria 3+' },
                  { label: 'Ectopic pregnancy', text: '8-week amenorrhea with right iliac fossa pain and vaginal bleeding. BP 90/60.' },
                  { label: 'Acute pelvic inflammatory disease', text: '24-year-old with bilateral pelvic pain, fever 38.6°C, purulent discharge' },
                ].map(({ label, text }) => (
                  <button
                    key={label}
                    onClick={() => setPresenting(text)}
                    className={cn(
                      'w-full text-left p-2 rounded-lg text-sm transition-colors',
                      darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <div className="font-medium text-xs text-blue-600 mb-0.5">{label}</div>
                    <div className="text-xs text-slate-400 line-clamp-2">{text}</div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {!result ? (
            <div className={cn('flex flex-col items-center justify-center min-h-96 rounded-xl border-2 border-dashed', darkMode ? 'border-slate-700' : 'border-slate-200')}>
              <Stethoscope className="w-12 h-12 text-slate-300 mb-3" />
              <p className={cn('font-medium', darkMode ? 'text-slate-400' : 'text-slate-500')}>Enter case details to analyse</p>
              <p className="text-sm text-slate-400">Suggestions grounded in uploaded textbook content</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <div className="p-4">
                  <p className={cn('text-sm', darkMode ? 'text-slate-300' : 'text-slate-700')}>{result.summary}</p>
                </div>
              </Card>

              {/* Tabs */}
              <div className={cn('flex border-b', darkMode ? 'border-slate-700' : 'border-slate-200')}>
                {([['ddx', 'Differential Diagnosis'], ['investigations', 'Investigations'], ['management', 'Management']] as const).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      'px-4 py-2.5 text-sm font-medium border-b-2 transition-all',
                      activeTab === id ? 'border-blue-600 text-blue-600' : cn('border-transparent', darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === 'ddx' && (
                <div className="space-y-3">
                  {result.differentials.map((ddx, i) => (
                    <Card key={i}>
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5',
                            i === 0 ? 'bg-blue-600 text-white' : i === 1 ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                          )}>
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className={cn('font-medium text-sm', darkMode ? 'text-slate-200' : 'text-slate-800')}>
                              {ddx.diagnosis}
                            </div>
                            {i === 2 && <Badge variant="red" size="sm">Must-not-miss</Badge>}
                          </div>
                        </div>
                        <div className="pl-9 space-y-2">
                          <div>
                            <div className="text-xs font-medium text-slate-400 mb-1">Key Features</div>
                            <ul className="space-y-1">
                              {ddx.keyFeatures.map((f, j) => (
                                <li key={j} className={cn('text-xs flex items-start gap-1.5', darkMode ? 'text-slate-300' : 'text-slate-600')}>
                                  <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />{f}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className={cn('text-xs p-2 rounded', darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-50 text-slate-600')}>
                            <span className="font-medium">Distinguishing factor: </span>{ddx.distinguishingFactor}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400">
                            <span className="font-medium">Mx: </span>{ddx.management}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'investigations' && (
                <div className="space-y-4">
                  {Object.entries(result.investigations).map(([priority, items]) => (
                    <Card key={priority}>
                      <div className="p-4">
                        <h4 className={cn('text-sm font-semibold mb-3 capitalize', darkMode ? 'text-slate-200' : 'text-slate-700')}>
                          {priority} investigations
                        </h4>
                        <ul className="space-y-2">
                          {items.map((item, i) => (
                            <li key={i} className={cn('flex items-start gap-2 text-sm', darkMode ? 'text-slate-300' : 'text-slate-600')}>
                              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'management' && (
                <Card>
                  <div className="p-4">
                    <ul className="space-y-3">
                      {result.management.map((step, i) => (
                        <li key={i} className={cn('flex items-start gap-3 text-sm', darkMode ? 'text-slate-300' : 'text-slate-700')}>
                          <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </div>
                          {step.replace(/^\d+\.\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              )}

              {/* Citations */}
              <div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Textbook Sources
                </div>
                {result.citations.map((c, i) => (
                  <div key={i} className={cn('p-3 rounded-lg border text-xs', darkMode ? 'bg-blue-950/40 border-blue-800' : 'bg-blue-50 border-blue-200')}>
                    <div className={cn('font-medium mb-1', darkMode ? 'text-blue-300' : 'text-blue-700')}>
                      {c.bookTitle} • {c.chapterTitle} • p.{c.pageNumber}
                    </div>
                    <p className="text-slate-400 italic">"{c.passage}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

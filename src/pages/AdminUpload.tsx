import { useState } from 'react';
import {
  Upload, FileText, CheckCircle2, XCircle, Clock, BookOpen,
  AlertTriangle, Layers, ChevronRight, Zap, Eye
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn, formatDate } from '../lib/utils';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

type UploadStep = 'idle' | 'uploading' | 'ocr' | 'chunking' | 'indexing' | 'complete' | 'failed';

const STEP_LABELS: Record<UploadStep, string> = {
  idle: 'Ready',
  uploading: 'Uploading PDF...',
  ocr: 'Running OCR extraction...',
  chunking: 'Chunking & extracting figures...',
  indexing: 'Generating embeddings & indexing...',
  complete: 'Indexed successfully!',
  failed: 'Processing failed',
};

const STEPS: UploadStep[] = ['uploading', 'ocr', 'chunking', 'indexing', 'complete'];

export default function AdminUpload() {
  const { books, user, darkMode } = useAppStore();
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState<UploadStep>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [edition, setEdition] = useState('');
  const [subject, setSubject] = useState('Obstetrics');

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto text-center py-24">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className={cn('text-xl font-bold mb-2', darkMode ? 'text-white' : 'text-slate-800')}>Admin Access Required</h2>
        <p className="text-slate-400">Book upload is restricted to administrators.</p>
        <p className="text-sm text-slate-400 mt-1">Current role: <span className="capitalize font-medium text-blue-600">{user?.role}</span></p>
      </div>
    );
  }

  async function simulateUpload() {
    if (!title.trim()) return;
    setStep('uploading');
    setUploadProgress(0);

    for (const s of STEPS) {
      setStep(s);
      for (let p = 0; p <= 100; p += 5) {
        setUploadProgress(p);
        await new Promise((r) => setTimeout(r, 40));
      }
    }
    setStep('complete');
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className={cn(
        'flex items-center gap-3 p-4 rounded-xl border',
        darkMode ? 'bg-blue-950 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
      )}>
        <Zap className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm">
          <strong>Admin Panel:</strong> Upload PDF textbooks for OCR processing, chapter extraction, figure detection, and vector indexing. Books are available to all users after indexing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload form */}
        <div className="space-y-4">
          <Card>
            <div className="p-4 space-y-4">
              <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>Book Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="label">Book Title *</label>
                  <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Williams Obstetrics" />
                </div>
                <div className="col-span-2">
                  <label className="label">Authors (comma-separated)</label>
                  <input className="input" value={authors} onChange={(e) => setAuthors(e.target.value)} placeholder="e.g. Cunningham FG, Leveno KJ" />
                </div>
                <div>
                  <label className="label">Edition</label>
                  <input className="input" value={edition} onChange={(e) => setEdition(e.target.value)} placeholder="e.g. 26th" />
                </div>
                <div>
                  <label className="label">Subject</label>
                  <select className="input" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    {['Obstetrics', 'Gynecology', 'Radiology', 'Anatomy', 'Internal Medicine', 'Surgery', 'Pediatrics'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Upload area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); simulateUpload(); }}
            className={cn(
              'rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer',
              dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : darkMode ? 'border-slate-600 hover:border-slate-400' : 'border-slate-300 hover:border-blue-300 hover:bg-slate-50'
            )}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input id="file-input" type="file" accept=".pdf" className="hidden" onChange={() => simulateUpload()} />
            <Upload className={cn('w-10 h-10 mx-auto mb-3', dragOver ? 'text-blue-600' : 'text-slate-300')} />
            <p className={cn('font-medium', darkMode ? 'text-slate-300' : 'text-slate-700')}>
              Drag & drop PDF or click to browse
            </p>
            <p className="text-sm text-slate-400 mt-1">Supports PDF, image-based PDFs (OCR applied)</p>
          </div>

          {step !== 'idle' && (
            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={cn('text-sm font-medium', darkMode ? 'text-slate-300' : 'text-slate-700')}>
                    {STEP_LABELS[step]}
                  </span>
                  {step === 'complete' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {step === 'failed' && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
                <div className={cn('h-2 rounded-full overflow-hidden', darkMode ? 'bg-slate-700' : 'bg-slate-200')}>
                  <div
                    className={cn('h-full rounded-full transition-all duration-200', step === 'complete' ? 'bg-green-500' : step === 'failed' ? 'bg-red-500' : 'bg-blue-500')}
                    style={{ width: step === 'complete' ? '100%' : `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-3">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-1">
                      <div className={cn(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold',
                        STEPS.indexOf(step) > i || step === 'complete'
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : STEPS.indexOf(step) === i
                            ? 'border-blue-500 text-blue-500'
                            : 'border-slate-200 text-slate-400'
                      )}>
                        {STEPS.indexOf(step) > i || step === 'complete' ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                      </div>
                      <span className="text-xs text-slate-400 hidden sm:block">{['Upload', 'OCR', 'Chunk', 'Index', 'Done'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <button
            onClick={simulateUpload}
            disabled={!title.trim() || (step !== 'idle' && step !== 'complete' && step !== 'failed')}
            className="w-full btn-primary justify-center"
          >
            <BookOpen className="w-4 h-4" /> Process & Index Book
          </button>
        </div>

        {/* Existing books */}
        <div>
          <h3 className={cn('text-sm font-semibold uppercase tracking-wide mb-3', darkMode ? 'text-slate-400' : 'text-slate-500')}>
            Library ({books.length} books)
          </h3>
          <div className="space-y-3">
            {books.map((book) => (
              <div key={book.id} className={cn('card p-3 flex items-start gap-3')}>
                <div
                  className="w-9 h-11 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: book.coverColor }}
                >
                  {book.title.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn('text-sm font-medium truncate', darkMode ? 'text-slate-200' : 'text-slate-800')}>{book.title}</div>
                  <div className="text-xs text-slate-400">{book.edition} ed. • {book.totalPages}p • {book.totalChapters} chapters</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={book.status === 'indexed' ? 'green' : book.status === 'processing' ? 'orange' : 'red'} size="sm">
                      {book.status}
                    </Badge>
                    <span className="text-xs text-slate-400">{formatDate(book.uploadedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={cn('mt-4 p-3 rounded-xl border text-xs space-y-2', darkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500')}>
            <div className="font-medium flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Pipeline (Placeholder)
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> PDF parsing with PyMuPDF</div>
              <div className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> OCR via AWS Textract / Tesseract</div>
              <div className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Chunking (1000 tokens, 200 overlap)</div>
              <div className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Figure extraction & captioning</div>
              <div className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Embedding via text-embedding-3-small</div>
              <div className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Vector indexing in ChromaDB / Pinecone</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

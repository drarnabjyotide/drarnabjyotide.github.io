import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

export const CHAT_MODE_LABELS: Record<string, string> = {
  explain: 'Explain Topic',
  study: 'Study Mode',
  flashcards: 'Flashcards',
  comparison: 'Comparison Chart',
  exam_revision: 'Exam Revision',
  diagram_builder: 'Diagram Builder',
  case_assistant: 'Case Assistant',
};

export const CHAT_MODE_DESCRIPTIONS: Record<string, string> = {
  explain: 'Deep explanation of any topic from uploaded textbooks with citations',
  study: 'Structured study notes with key points, mnemonics, and summaries',
  flashcards: 'Auto-generate flashcards from any topic or chapter',
  comparison: 'Side-by-side comparison tables for differential diagnosis',
  exam_revision: 'High-yield exam revision with MCQ-style Q&A',
  diagram_builder: 'Generate concept maps and flowcharts from textbook content',
  case_assistant: 'Clinical case analysis with investigations and management',
};

export const USG_TEMPLATE_LABELS: Record<string, string> = {
  obstetric_1st_trimester: 'Obstetric — 1st Trimester',
  obstetric_2nd_3rd_trimester: 'Obstetric — 2nd/3rd Trimester',
  gynecological: 'Gynecological (Pelvic)',
  abdominal: 'Abdominal (Complete)',
  thyroid: 'Thyroid & Parathyroid',
  breast: 'Breast (BIRADS)',
  scrotal: 'Scrotal',
  musculoskeletal: 'Musculoskeletal',
  vascular: 'Vascular (Doppler)',
  renal: 'Renal & Urinary Tract',
};

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

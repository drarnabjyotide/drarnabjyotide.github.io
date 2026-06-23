export type UserRole = 'admin' | 'doctor' | 'resident' | 'student' | 'radiologist' | 'sonologist';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  specialization: string;
  institution: string;
  joinedAt: string;
  lastActive: string;
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  edition: string;
  year: number;
  publisher: string;
  subject: string;
  totalPages: number;
  totalChapters: number;
  totalFigures: number;
  uploadedAt: string;
  uploadedBy: string;
  status: 'processing' | 'indexed' | 'failed';
  coverColor: string;
  description: string;
  tags: string[];
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  number: number;
  startPage: number;
  endPage: number;
  subchapters: SubChapter[];
}

export interface SubChapter {
  id: string;
  title: string;
  startPage: number;
}

export interface Figure {
  id: string;
  bookId: string;
  chapterId: string;
  pageNumber: number;
  caption: string;
  type: 'diagram' | 'image' | 'table' | 'graph' | 'flowchart' | 'ultrasound';
  description: string;
}

export interface Citation {
  bookId: string;
  bookTitle: string;
  authors: string[];
  chapterTitle: string;
  pageNumber: number;
  passage: string;
  figureId?: string;
  relevanceScore: number;
}

export type ChatMode =
  | 'explain'
  | 'study'
  | 'flashcards'
  | 'comparison'
  | 'exam_revision'
  | 'diagram_builder'
  | 'case_assistant';

export interface Flashcard {
  id: string;
  userId: string;
  front: string;
  back: string;
  hint?: string;
  category: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: string;
  interval: number;
  repetitions: number;
  easeFactor: number;
  bookId?: string;
  bookTitle?: string;
  chapterTitle?: string;
  pageNumber?: number;
  createdAt: string;
  lastReviewed?: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  description?: string;
  type: 'concept' | 'process' | 'decision' | 'outcome' | 'category' | 'organ';
  color?: string;
  x: number;
  y: number;
}

export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  type: 'arrow' | 'bidirectional' | 'dashed';
}

export interface DiagramData {
  id: string;
  title: string;
  type: 'concept_map' | 'flowchart' | 'comparison' | 'hierarchy' | 'cycle';
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  description: string;
  citations?: Citation[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  mode: ChatMode;
  createdAt: string;
  flashcards?: Flashcard[];
  diagram?: DiagramData;
  keyPoints?: string[];
  mnemonics?: string[];
  ddx?: DDxEntry[];
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  mode: ChatMode;
  bookIds: string[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
  bookmarked: boolean;
}

export interface DDxEntry {
  diagnosis: string;
  keyFeatures: string[];
  distinguishingFactor: string;
  investigations: string[];
  management: string;
}

export type USGTemplate =
  | 'obstetric_1st_trimester'
  | 'obstetric_2nd_3rd_trimester'
  | 'gynecological'
  | 'abdominal'
  | 'thyroid'
  | 'breast'
  | 'scrotal'
  | 'musculoskeletal'
  | 'vascular'
  | 'renal';

export interface USGReportField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'measurement' | 'select' | 'checkbox';
  unit?: string;
  options?: string[];
  required: boolean;
  placeholder?: string;
  textbookRef?: string;
}

export interface USGReportSection {
  id: string;
  title: string;
  fields: USGReportField[];
  generated?: string;
}

export interface USGReport {
  id: string;
  userId: string;
  template: USGTemplate;
  templateLabel: string;
  sections: USGReportSection[];
  generatedReport?: string;
  status: 'draft' | 'complete';
  bookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  bookId?: string;
  bookTitle?: string;
  chapterId?: string;
  pageNumber?: number;
  createdAt: string;
  updatedAt: string;
  bookmarked: boolean;
  source: 'manual' | 'chat' | 'study_session';
}

export interface StudySession {
  id: string;
  userId: string;
  topic: string;
  bookId: string;
  bookTitle: string;
  summary: string;
  keyPoints: string[];
  mnemonics: string[];
  flashcardsCount: number;
  ddxTable?: DDxEntry[];
  citations: Citation[];
  createdAt: string;
}

export interface ExportItem {
  id: string;
  type: 'chat' | 'flashcard_deck' | 'note' | 'report' | 'study_session' | 'diagram';
  title: string;
  selected: boolean;
}

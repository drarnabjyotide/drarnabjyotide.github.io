export type PrivacyLevel = 'public' | 'private' | 'sensitive';
export type SourceType = 'upload' | 'gdrive' | 'gmail' | 'calendar' | 'notes' | 'manual';
export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'mock';

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

export interface SourceDocument {
  id: string;
  user_id: string;
  source_type: SourceType;
  title: string;
  raw_content: string;
  file_url?: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  source_document_id?: string;
  source_document?: SourceDocument;
  timestamp: string;
  privacy_level: PrivacyLevel;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Citation {
  memory_id: string;
  memory_title: string;
  source_title?: string;
  excerpt: string;
  confidence: number;
}

export interface Conversation {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  citations: Citation[];
  created_at: string;
}

export interface Connection {
  id: string;
  user_id: string;
  provider: SourceType;
  status: ConnectionStatus;
  access_level: string;
  last_synced?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
  isStreaming?: boolean;
}

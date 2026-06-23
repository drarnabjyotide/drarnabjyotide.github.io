import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Memory, SourceDocument, Conversation, Connection, Tag, ChatMessage } from '../types';
import {
  DEMO_MEMORIES,
  DEMO_SOURCES,
  DEMO_CONVERSATIONS,
  DEMO_CONNECTIONS,
  DEMO_TAGS,
} from '../lib/seedData';

interface AppState {
  // Auth (demo mode)
  isAuthenticated: boolean;
  userEmail: string;
  isDemoMode: boolean;

  // Data
  memories: Memory[];
  sources: SourceDocument[];
  conversations: Conversation[];
  connections: Connection[];
  tags: Tag[];
  chatMessages: ChatMessage[];

  // UI
  sidebarOpen: boolean;
  onboardingDone: boolean;
  searchQuery: string;

  // Auth actions
  signIn: (email: string) => void;
  signOut: () => void;

  // Memory actions
  addMemory: (m: Omit<Memory, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Memory;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;
  togglePin: (id: string) => void;

  // Source actions
  addSource: (s: Omit<SourceDocument, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => SourceDocument;
  deleteSource: (id: string) => void;

  // Conversation actions
  addConversation: (c: Omit<Conversation, 'id' | 'user_id' | 'created_at'>) => void;
  addChatMessage: (m: ChatMessage) => void;
  updateChatMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearChat: () => void;

  // Connection actions
  connectProvider: (provider: Connection['provider']) => void;
  disconnectProvider: (id: string) => void;

  // UI actions
  setSidebarOpen: (open: boolean) => void;
  setOnboardingDone: () => void;
  setSearchQuery: (q: string) => void;
}

const makeId = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userEmail: '',
      isDemoMode: true,
      memories: DEMO_MEMORIES,
      sources: DEMO_SOURCES,
      conversations: DEMO_CONVERSATIONS,
      connections: DEMO_CONNECTIONS,
      tags: DEMO_TAGS,
      chatMessages: [],
      sidebarOpen: true,
      onboardingDone: false,
      searchQuery: '',

      signIn: (email) =>
        set({
          isAuthenticated: true,
          userEmail: email,
          isDemoMode: true,
          onboardingDone: false,
        }),

      signOut: () =>
        set({
          isAuthenticated: false,
          userEmail: '',
          chatMessages: [],
          memories: DEMO_MEMORIES,
          sources: DEMO_SOURCES,
          conversations: DEMO_CONVERSATIONS,
        }),

      addMemory: (m) => {
        const memory: Memory = {
          ...m,
          id: makeId(),
          user_id: 'demo-user-001',
          created_at: now(),
          updated_at: now(),
        };
        set((s) => ({ memories: [memory, ...s.memories] }));
        return memory;
      },

      updateMemory: (id, updates) =>
        set((s) => ({
          memories: s.memories.map((m) =>
            m.id === id ? { ...m, ...updates, updated_at: now() } : m
          ),
        })),

      deleteMemory: (id) =>
        set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),

      togglePin: (id) =>
        set((s) => ({
          memories: s.memories.map((m) =>
            m.id === id ? { ...m, pinned: !m.pinned, updated_at: now() } : m
          ),
        })),

      addSource: (s) => {
        const source: SourceDocument = {
          ...s,
          id: makeId(),
          user_id: 'demo-user-001',
          created_at: now(),
          updated_at: now(),
        };
        set((st) => ({ sources: [source, ...st.sources] }));
        return source;
      },

      deleteSource: (id) =>
        set((s) => ({ sources: s.sources.filter((d) => d.id !== id) })),

      addConversation: (c) =>
        set((s) => ({
          conversations: [
            { ...c, id: makeId(), user_id: 'demo-user-001', created_at: now() },
            ...s.conversations,
          ],
        })),

      addChatMessage: (m) =>
        set((s) => ({ chatMessages: [...s.chatMessages, m] })),

      updateChatMessage: (id, updates) =>
        set((s) => ({
          chatMessages: s.chatMessages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),

      clearChat: () => set({ chatMessages: [] }),

      connectProvider: (provider) =>
        set((s) => ({
          connections: s.connections.map((c) =>
            c.provider === provider
              ? { ...c, status: 'mock', last_synced: now() }
              : c
          ),
        })),

      disconnectProvider: (id) =>
        set((s) => ({
          connections: s.connections.map((c) =>
            c.id === id ? { ...c, status: 'disconnected', last_synced: undefined } : c
          ),
        })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setOnboardingDone: () => set({ onboardingDone: true }),
      setSearchQuery: (q) => set({ searchQuery: q }),
    }),
    {
      name: 'memoryos-storage',
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        userEmail: s.userEmail,
        memories: s.memories,
        sources: s.sources,
        conversations: s.conversations,
        connections: s.connections,
        tags: s.tags,
        onboardingDone: s.onboardingDone,
      }),
    }
  )
);

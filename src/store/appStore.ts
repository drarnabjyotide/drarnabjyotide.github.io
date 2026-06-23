import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User, Book, Conversation, Flashcard, Note, StudySession,
  USGReport, DiagramData, ChatMode, Message, Citation
} from '../types';
import {
  SAMPLE_USER, SAMPLE_BOOKS, SAMPLE_CONVERSATIONS, SAMPLE_FLASHCARDS,
  SAMPLE_NOTES, SAMPLE_STUDY_SESSIONS, SAMPLE_REPORTS, SAMPLE_DIAGRAMS
} from '../data/sampleData';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Library
  books: Book[];
  selectedBookIds: string[];
  setSelectedBookIds: (ids: string[]) => void;

  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  createConversation: (mode: ChatMode, bookIds: string[]) => Conversation;
  addMessage: (conversationId: string, message: Message) => void;
  toggleBookmarkConversation: (id: string) => void;
  deleteConversation: (id: string) => void;

  // Flashcards
  flashcards: Flashcard[];
  addFlashcard: (card: Omit<Flashcard, 'id' | 'userId' | 'createdAt'>) => void;
  updateFlashcardReview: (id: string, quality: number) => void;
  deleteFlashcard: (id: string) => void;

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleBookmarkNote: (id: string) => void;

  // Study Sessions
  studySessions: StudySession[];

  // Reports
  reports: USGReport[];
  addReport: (report: USGReport) => void;
  updateReport: (id: string, updates: Partial<USGReport>) => void;
  toggleBookmarkReport: (id: string) => void;

  // Diagrams
  diagrams: DiagramData[];
  addDiagram: (diagram: DiagramData) => void;

  // AI Loading state
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;

  // Search
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, _password: string) => {
        await new Promise((r) => setTimeout(r, 800));
        if (email.includes('@')) {
          set({ user: SAMPLE_USER, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, isAuthenticated: false }),

      darkMode: false,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      books: SAMPLE_BOOKS,
      selectedBookIds: ['b1', 'b2', 'b3'],
      setSelectedBookIds: (ids) => set({ selectedBookIds: ids }),

      conversations: SAMPLE_CONVERSATIONS,
      activeConversationId: null,
      setActiveConversation: (id) => set({ activeConversationId: id }),
      createConversation: (mode, bookIds) => {
        const conv: Conversation = {
          id: generateId(),
          userId: get().user?.id || 'u1',
          title: 'New conversation',
          mode,
          bookIds,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [],
          bookmarked: false,
        };
        set((s) => ({ conversations: [conv, ...s.conversations], activeConversationId: conv.id }));
        return conv;
      },
      addMessage: (conversationId, message) => {
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  updatedAt: new Date().toISOString(),
                  title: c.messages.length === 0 && message.role === 'user'
                    ? message.content.slice(0, 60)
                    : c.title,
                }
              : c
          ),
        }));
      },
      toggleBookmarkConversation: (id) => {
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, bookmarked: !c.bookmarked } : c
          ),
        }));
      },
      deleteConversation: (id) => {
        set((s) => ({ conversations: s.conversations.filter((c) => c.id !== id) }));
      },

      flashcards: SAMPLE_FLASHCARDS,
      addFlashcard: (card) => {
        const fc: Flashcard = {
          ...card,
          id: generateId(),
          userId: get().user?.id || 'u1',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ flashcards: [fc, ...s.flashcards] }));
      },
      updateFlashcardReview: (id, quality) => {
        set((s) => ({
          flashcards: s.flashcards.map((fc) => {
            if (fc.id !== id) return fc;
            const ef = Math.max(1.3, fc.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
            const interval = quality < 3 ? 1 : fc.repetitions === 0 ? 1 : fc.repetitions === 1 ? 6 : Math.round(fc.interval * ef);
            return {
              ...fc,
              interval,
              repetitions: quality < 3 ? 0 : fc.repetitions + 1,
              easeFactor: ef,
              lastReviewed: new Date().toISOString(),
              nextReview: new Date(Date.now() + interval * 24 * 60 * 60 * 1000).toISOString(),
            };
          }),
        }));
      },
      deleteFlashcard: (id) => set((s) => ({ flashcards: s.flashcards.filter((fc) => fc.id !== id) })),

      notes: SAMPLE_NOTES,
      addNote: (note) => {
        const n: Note = {
          ...note,
          id: generateId(),
          userId: get().user?.id || 'u1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ notes: [n, ...s.notes] }));
      },
      updateNote: (id, updates) => {
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
          ),
        }));
      },
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      toggleBookmarkNote: (id) => {
        set((s) => ({ notes: s.notes.map((n) => n.id === id ? { ...n, bookmarked: !n.bookmarked } : n) }));
      },

      studySessions: SAMPLE_STUDY_SESSIONS,

      reports: SAMPLE_REPORTS,
      addReport: (report) => set((s) => ({ reports: [report, ...s.reports] })),
      updateReport: (id, updates) => {
        set((s) => ({ reports: s.reports.map((r) => r.id === id ? { ...r, ...updates } : r) }));
      },
      toggleBookmarkReport: (id) => {
        set((s) => ({ reports: s.reports.map((r) => r.id === id ? { ...r, bookmarked: !r.bookmarked } : r) }));
      },

      diagrams: SAMPLE_DIAGRAMS,
      addDiagram: (diagram) => set((s) => ({ diagrams: [diagram, ...s.diagrams] })),

      isGenerating: false,
      setIsGenerating: (v) => set({ isGenerating: v }),

      globalSearchQuery: '',
      setGlobalSearchQuery: (q) => set({ globalSearchQuery: q }),
    }),
    {
      name: 'medmother-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        darkMode: state.darkMode,
        selectedBookIds: state.selectedBookIds,
        conversations: state.conversations,
        flashcards: state.flashcards,
        notes: state.notes,
        reports: state.reports,
        diagrams: state.diagrams,
      }),
    }
  )
);

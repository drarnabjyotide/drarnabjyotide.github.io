import { MessageSquare, BookOpen, CreditCard, Table, GraduationCap, GitBranch, Stethoscope } from 'lucide-react';
import type { ChatMode } from '../../types';
import { CHAT_MODE_LABELS, CHAT_MODE_DESCRIPTIONS, cn } from '../../lib/utils';

const MODE_ICONS: Record<ChatMode, React.ReactNode> = {
  explain: <MessageSquare className="w-4 h-4" />,
  study: <BookOpen className="w-4 h-4" />,
  flashcards: <CreditCard className="w-4 h-4" />,
  comparison: <Table className="w-4 h-4" />,
  exam_revision: <GraduationCap className="w-4 h-4" />,
  diagram_builder: <GitBranch className="w-4 h-4" />,
  case_assistant: <Stethoscope className="w-4 h-4" />,
};

const MODE_COLORS: Record<ChatMode, string> = {
  explain: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
  study: 'text-teal-600 bg-teal-50 border-teal-200 dark:bg-teal-950 dark:border-teal-800',
  flashcards: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800',
  comparison: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800',
  exam_revision: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
  diagram_builder: 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800',
  case_assistant: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
};

const MODES: ChatMode[] = ['explain', 'study', 'flashcards', 'comparison', 'exam_revision', 'diagram_builder', 'case_assistant'];

interface ModeSelectorProps {
  active: ChatMode;
  onChange: (mode: ChatMode) => void;
  darkMode?: boolean;
}

export default function ModeSelector({ active, onChange, darkMode }: ModeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {MODES.map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          title={CHAT_MODE_DESCRIPTIONS[mode]}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all',
            active === mode
              ? MODE_COLORS[mode] + ' ring-1 ring-inset ring-current'
              : darkMode
                ? 'text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'
                : 'text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
          )}
        >
          {MODE_ICONS[mode]}
          {CHAT_MODE_LABELS[mode]}
        </button>
      ))}
    </div>
  );
}

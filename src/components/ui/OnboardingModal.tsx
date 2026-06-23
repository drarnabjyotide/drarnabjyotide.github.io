import { useState } from 'react';
import { Brain, Upload, MessageSquare, BookMarked, ArrowRight } from 'lucide-react';
import Modal from './Modal';
import { useAppStore } from '../../store/useAppStore';

const STEPS = [
  {
    icon: Brain,
    color: 'from-brand-500 to-brand-700',
    title: 'Welcome to MemoryOS',
    body: 'Your personal second brain. Store, search, and chat with your own documents, notes, and memories in one private place.',
  },
  {
    icon: Upload,
    color: 'from-purple-500 to-purple-700',
    title: 'Import your content',
    body: 'Upload PDFs, notes, and documents — or connect Google Drive, Gmail, Calendar, and Apple Notes. Everything stays private.',
  },
  {
    icon: BookMarked,
    color: 'from-emerald-500 to-emerald-700',
    title: 'Memories are your building blocks',
    body: 'Each memory is a card with content, tags, and a source. You can pin, edit, tag, or forget them at any time.',
  },
  {
    icon: MessageSquare,
    color: 'from-amber-500 to-amber-600',
    title: 'Chat with your knowledge',
    body: 'Ask questions in natural language and get answers cited directly from your own documents. No hallucinations — only what you\'ve stored.',
  },
];

export default function OnboardingModal() {
  const { onboardingDone, setOnboardingDone, isAuthenticated } = useAppStore();
  const [step, setStep] = useState(0);

  if (onboardingDone || !isAuthenticated) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <Modal open size="sm" onClose={setOnboardingDone}>
      <div className="text-center space-y-5">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-brand-500' : 'w-1.5 bg-gray-200'}`}
            />
          ))}
        </div>

        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${current.color} flex items-center justify-center mx-auto shadow-sm`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{current.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{current.body}</p>
        </div>

        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={() => isLast ? setOnboardingDone() : setStep(s => s + 1)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors"
          >
            {isLast ? 'Get started' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <button onClick={setOnboardingDone} className="text-xs text-gray-400 hover:text-gray-600">
          Skip tour
        </button>
      </div>
    </Modal>
  );
}

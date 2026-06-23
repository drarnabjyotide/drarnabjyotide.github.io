import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  darkMode?: boolean;
}

export default function Modal({ open, onClose, title, children, size = 'md', darkMode }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative w-full rounded-2xl shadow-2xl border overflow-hidden animate-fade-in',
          sizeClass,
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        )}
      >
        {title && (
          <div className={cn('flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-slate-700' : 'border-slate-100')}>
            <h2 className={cn('text-lg font-semibold', darkMode ? 'text-slate-100' : 'text-slate-800')}>{title}</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}

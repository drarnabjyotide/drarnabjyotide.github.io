import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'teal' | 'green' | 'red' | 'orange' | 'slate' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

const VARIANTS = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
};

export default function Badge({ children, variant = 'blue', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        VARIANTS[variant],
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1',
        className
      )}
    >
      {children}
    </span>
  );
}

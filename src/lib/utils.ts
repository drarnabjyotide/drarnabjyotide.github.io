import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + '…' : str;
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getConfidenceLabel(score: number): { label: string; color: string } {
  if (score >= 0.85) return { label: 'High', color: 'text-emerald-600 bg-emerald-50' };
  if (score >= 0.6) return { label: 'Medium', color: 'text-amber-600 bg-amber-50' };
  return { label: 'Low', color: 'text-red-500 bg-red-50' };
}

export function getSourceIcon(type: string): string {
  const icons: Record<string, string> = {
    upload: '📄',
    gdrive: '📁',
    gmail: '✉️',
    calendar: '📅',
    notes: '📝',
    manual: '✏️',
  };
  return icons[type] || '📌';
}

export const TAG_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#06b6d4',
];

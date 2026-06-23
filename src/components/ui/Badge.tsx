import { cn } from '../../lib/utils';

interface BadgeProps {
  label: string;
  color?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function TagBadge({ label, color, size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        className
      )}
      style={{
        backgroundColor: color ? `${color}18` : '#e0e7ff',
        color: color || '#4f46e5',
      }}
    >
      {label}
    </span>
  );
}

export function PrivacyBadge({ level }: { level: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    public: { label: 'Public', cls: 'bg-emerald-50 text-emerald-700' },
    private: { label: 'Private', cls: 'bg-gray-100 text-gray-600' },
    sensitive: { label: 'Sensitive', cls: 'bg-red-50 text-red-600' },
  };
  const { label, cls } = map[level] || map.private;
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

export function ConfidenceBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const cls =
    pct >= 85 ? 'bg-emerald-50 text-emerald-700' :
    pct >= 60 ? 'bg-amber-50 text-amber-700' :
    'bg-red-50 text-red-600';
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {pct >= 85 ? 'High' : pct >= 60 ? 'Medium' : 'Low'} · {pct}%
    </span>
  );
}

export function SourceTypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    upload: { label: 'Upload', cls: 'bg-blue-50 text-blue-700' },
    gdrive: { label: 'Drive', cls: 'bg-yellow-50 text-yellow-700' },
    gmail: { label: 'Gmail', cls: 'bg-red-50 text-red-700' },
    calendar: { label: 'Calendar', cls: 'bg-emerald-50 text-emerald-700' },
    notes: { label: 'Notes', cls: 'bg-orange-50 text-orange-700' },
    manual: { label: 'Manual', cls: 'bg-purple-50 text-purple-700' },
  };
  const { label, cls } = map[type] || { label: type, cls: 'bg-gray-100 text-gray-600' };
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}

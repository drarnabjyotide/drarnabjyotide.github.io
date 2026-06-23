import { useState } from 'react';
import { Pin, Edit2, Trash2, Eye, EyeOff, ExternalLink, MoreHorizontal, Download } from 'lucide-react';
import type { Memory } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { TagBadge, PrivacyBadge, SourceTypeBadge } from '../ui/Badge';
import { cn, formatRelativeTime, getSourceIcon, truncate } from '../../lib/utils';
import { DEMO_TAGS } from '../../lib/seedData';
import toast from 'react-hot-toast';

interface Props {
  memory: Memory;
  onEdit?: (m: Memory) => void;
  compact?: boolean;
}

export default function MemoryCard({ memory, onEdit, compact }: Props) {
  const { togglePin, deleteMemory, sources } = useAppStore();
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const source = sources.find((s) => s.id === memory.source_document_id);
  const tagObjects = DEMO_TAGS.filter((t) => memory.tags.includes(t.name));
  const isSensitive = memory.privacy_level === 'sensitive';
  const [revealSensitive, setRevealSensitive] = useState(false);

  const handleDelete = () => {
    deleteMemory(memory.id);
    toast.success('Memory deleted');
    setMenuOpen(false);
  };

  const handlePin = () => {
    togglePin(memory.id);
    toast.success(memory.pinned ? 'Unpinned' : 'Pinned memory');
  };

  const handleExport = () => {
    const data = `# ${memory.title}\n\n${memory.content}\n\nTags: ${memory.tags.join(', ')}\nDate: ${memory.timestamp}`;
    const blob = new Blob([data], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${memory.title.replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported');
    setMenuOpen(false);
  };

  const showContent = !isSensitive || revealSensitive;

  return (
    <div className={cn(
      'bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all border border-gray-50 group relative',
      compact ? 'p-4' : 'p-5',
      memory.pinned && 'ring-1 ring-brand-200'
    )}>
      {memory.pinned && (
        <div className="absolute top-3 right-3">
          <Pin className="w-3.5 h-3.5 text-brand-400 fill-brand-200" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-base flex-shrink-0">
          {source ? getSourceIcon(source.source_type) : '✏️'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn('font-semibold text-gray-900 leading-snug', compact ? 'text-sm' : 'text-sm')}>
            {memory.title}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-gray-400">{formatRelativeTime(memory.timestamp)}</span>
            {source && <SourceTypeBadge type={source.source_type} />}
            <PrivacyBadge level={memory.privacy_level} />
          </div>
        </div>

        {/* Actions menu */}
        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white border border-gray-100 rounded-xl shadow-modal py-1 min-w-[140px]">
                {[
                  { icon: Pin, label: memory.pinned ? 'Unpin' : 'Pin', action: handlePin },
                  { icon: Edit2, label: 'Edit', action: () => { onEdit?.(memory); setMenuOpen(false); } },
                  { icon: Download, label: 'Export', action: handleExport },
                  { icon: Trash2, label: 'Delete', action: handleDelete, danger: true },
                ].map(({ icon: Icon, label, action, danger }) => (
                  <button
                    key={label}
                    onClick={action}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors',
                      danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {isSensitive && !revealSensitive ? (
        <div className="flex items-center gap-2 py-3 px-3 bg-red-50 rounded-xl mb-3">
          <EyeOff className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-600 flex-1">Sensitive content hidden</p>
          <button
            onClick={() => setRevealSensitive(true)}
            className="text-xs text-red-500 font-medium hover:text-red-700"
          >
            Reveal
          </button>
        </div>
      ) : (
        <div className="mb-3">
          <p className={cn('text-sm text-gray-600 leading-relaxed', !expanded && 'line-clamp-3')}>
            {memory.content}
          </p>
          {memory.content.length > 160 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-brand-500 hover:text-brand-700 mt-1 font-medium"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
          {revealSensitive && (
            <button
              onClick={() => setRevealSensitive(false)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mt-1"
            >
              <Eye className="w-3 h-3" /> Hide
            </button>
          )}
        </div>
      )}

      {/* Tags + Source */}
      <div className="flex items-center flex-wrap gap-1.5">
        {tagObjects.map((t) => (
          <TagBadge key={t.id} label={t.name} color={t.color} />
        ))}
        {source && (
          <span className="ml-auto flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer">
            <ExternalLink className="w-3 h-3" />
            {truncate(source.title, 24)}
          </span>
        )}
      </div>
    </div>
  );
}

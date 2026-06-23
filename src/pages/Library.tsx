import { useState, useMemo } from 'react';
import { Trash2, FileText, Calendar, HardDrive, Library, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SourceTypeBadge } from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { formatRelativeTime, getSourceIcon, truncate } from '../lib/utils';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

type SortKey = 'newest' | 'oldest' | 'name' | 'size';
type FilterType = 'all' | 'upload' | 'gdrive' | 'gmail' | 'calendar' | 'notes' | 'manual';

function formatSize(bytes?: number): string {
  if (!bytes) return '–';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function LibraryPage() {
  const { sources, memories, deleteSource, searchQuery } = useAppStore();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('list');

  const filtered = useMemo(() => {
    let result = [...sources];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.title.toLowerCase().includes(q) || s.raw_content.toLowerCase().includes(q)
      );
    }

    if (filterType !== 'all') result = result.filter((s) => s.source_type === filterType);

    result.sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sort === 'name') return a.title.localeCompare(b.title);
      if (sort === 'size') return (b.file_size || 0) - (a.file_size || 0);
      return 0;
    });

    return result;
  }, [sources, searchQuery, filterType, sort]);

  const handleDelete = (id: string) => {
    deleteSource(id);
    toast.success('Source deleted');
  };

  const memoryCount = (sourceId: string) =>
    memories.filter((m) => m.source_document_id === sourceId).length;

  const SOURCE_TYPES: FilterType[] = ['all', 'upload', 'gdrive', 'gmail', 'notes', 'calendar', 'manual'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{filtered.length} documents</h2>
          {searchQuery && <p className="text-xs text-gray-500 mt-0.5">Filtered by "{searchQuery}"</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {filtersOpen && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 space-y-4 animate-slide-up">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Source type</p>
              <div className="flex flex-wrap gap-2">
                {SOURCE_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-2.5 py-1 text-xs rounded-full font-medium capitalize transition-all ${
                      filterType === t ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t === 'all' ? 'All' : t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sort</p>
              <div className="flex gap-2">
                {([['newest', 'Newest'], ['oldest', 'Oldest'], ['name', 'Name'], ['size', 'Size']] as [SortKey, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSort(key)}
                    className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all ${
                      sort === key ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No documents found"
          description={searchQuery ? `Nothing matches "${searchQuery}"` : 'Import your first document from the Sources page'}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filtered.map((source) => {
              const mCount = memoryCount(source.id);
              return (
                <div
                  key={source.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-surface-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center text-xl flex-shrink-0">
                    {getSourceIcon(source.source_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="text-sm font-medium text-gray-800 truncate">{source.title}</p>
                      <SourceTypeBadge type={source.source_type} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatRelativeTime(source.created_at)}
                      </span>
                      {source.file_size && (
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          {formatSize(source.file_size)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {mCount} {mCount === 1 ? 'memory' : 'memories'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic">
                      {truncate(source.raw_content, 100)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(source.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

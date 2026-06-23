import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal, BookMarked, Pin } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import MemoryCard from '../components/memories/MemoryCard';
import MemoryEditor from '../components/memories/MemoryEditor';
import EmptyState from '../components/ui/EmptyState';
import type { Memory } from '../types';
import { DEMO_TAGS } from '../lib/seedData';

type SortKey = 'newest' | 'oldest' | 'title';
type FilterPrivacy = 'all' | 'private' | 'sensitive' | 'public';

export default function MemoriesPage() {
  const { memories, searchQuery } = useAppStore();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Memory | null>(null);
  const [filterTag, setFilterTag] = useState('all');
  const [filterPrivacy, setFilterPrivacy] = useState<FilterPrivacy>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [showPinned, setShowPinned] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...memories];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.content.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filterTag !== 'all') result = result.filter((m) => m.tags.includes(filterTag));
    if (filterPrivacy !== 'all') result = result.filter((m) => m.privacy_level === filterPrivacy);
    if (showPinned) result = result.filter((m) => m.pinned);

    result.sort((a, b) => {
      if (sort === 'newest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sort === 'oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [memories, searchQuery, filterTag, filterPrivacy, sort, showPinned]);

  const openEdit = (m: Memory) => {
    setEditTarget(m);
    setEditorOpen(true);
  };

  const openNew = () => {
    setEditTarget(null);
    setEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      <MemoryEditor
        open={editorOpen}
        onClose={() => { setEditorOpen(false); setEditTarget(null); }}
        memory={editTarget}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{filtered.length} memories</h2>
          {searchQuery && (
            <p className="text-xs text-gray-500 mt-0.5">Filtered by "{searchQuery}"</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded-xl hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New memory
          </button>
        </div>
      </div>

      {/* Filters */}
      {filtersOpen && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 space-y-4 animate-slide-up">
          {/* Tags */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tag</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterTag('all')}
                className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all ${
                  filterTag === 'all' ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {DEMO_TAGS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilterTag(filterTag === t.name ? 'all' : t.name)}
                  className="px-2.5 py-1 text-xs rounded-full font-medium transition-all"
                  style={filterTag === t.name
                    ? { backgroundColor: `${t.color}22`, color: t.color }
                    : { backgroundColor: '#f3f4f6', color: '#4b5563' }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            {/* Privacy */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Privacy</p>
              <div className="flex gap-2">
                {(['all', 'private', 'sensitive', 'public'] as FilterPrivacy[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilterPrivacy(p)}
                    className={`px-2.5 py-1 text-xs rounded-full font-medium capitalize transition-all ${
                      filterPrivacy === p ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sort</p>
              <div className="flex gap-2">
                {([['newest', 'Newest'], ['oldest', 'Oldest'], ['title', 'Title']] as [SortKey, string][]).map(([key, label]) => (
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

            {/* Pinned toggle */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Show</p>
              <button
                onClick={() => setShowPinned(!showPinned)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium transition-all ${
                  showPinned ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Pin className="w-3 h-3" /> Pinned only
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Memory grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No memories found"
          description={searchQuery ? `No memories match "${searchQuery}"` : "Create your first memory to get started"}
          action={{ label: 'New memory', onClick: openNew }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <MemoryCard key={m.id} memory={m} onEdit={openEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

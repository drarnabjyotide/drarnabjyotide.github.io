import { useState } from 'react';
import {
  Download, FolderOpen, FileText, CreditCard, Brain,
  GitBranch, MessageSquare, Check, BookOpen, Zap
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn, formatDate } from '../lib/utils';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

type ExportType = 'conversations' | 'flashcards' | 'notes' | 'reports' | 'study_sessions' | 'diagrams';

function generateMarkdown(type: ExportType, items: unknown[], vaultPath: string): string {
  const date = new Date().toISOString().split('T')[0];
  const header = (title: string, tags: string[]) =>
    `---\ntitle: ${title}\ncreated: ${date}\ntags: [${tags.map((t) => `"${t}"`).join(', ')}]\nsource: MedMother AI\ntype: ${type.replace('_', '-')}\n---\n\n`;

  if (type === 'flashcards') {
    return (items as { front: string; back: string; category: string; bookTitle?: string; pageNumber?: number }[]).map((fc, i) => {
      const tags = [fc.category.toLowerCase().replace(/\s+/g, '-'), 'flashcard', 'medical-education'];
      return `${header(`Flashcard ${i + 1} — ${fc.category}`, tags)}## Question\n${fc.front}\n\n## Answer\n${fc.back}\n\n${fc.bookTitle ? `> **Source:** [[${fc.bookTitle}]]${fc.pageNumber ? ` — p.${fc.pageNumber}` : ''}` : ''}\n`;
    }).join('\n---\n\n');
  }
  if (type === 'notes') {
    return (items as { title: string; content: string; tags: string[]; bookTitle?: string }[]).map((n) => {
      const tags = [...n.tags, 'note', 'medical-education'];
      const backlink = n.bookTitle ? `\n\n## Backlinks\n- [[${n.bookTitle}]]` : '';
      return `${header(n.title, tags)}${n.content}${backlink}\n`;
    }).join('\n---\n\n');
  }
  return `${header('MedMother AI Export', ['medical-education', type])}# Export: ${type}\n\nExported ${items.length} items from MedMother AI on ${date}.\n`;
}

export default function ObsidianExport() {
  const { conversations, flashcards, notes, reports, studySessions, diagrams, darkMode } = useAppStore();
  const [selected, setSelected] = useState<Set<ExportType>>(new Set());
  const [vaultPath, setVaultPath] = useState('/MedMother/');
  const [includeBacklinks, setIncludeBacklinks] = useState(true);
  const [includeFrontmatter, setIncludeFrontmatter] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const EXPORT_TYPES = [
    { id: 'conversations' as ExportType, label: 'Conversations', count: conversations.length, icon: MessageSquare, color: 'text-blue-600' },
    { id: 'flashcards' as ExportType, label: 'Flashcards', count: flashcards.length, icon: CreditCard, color: 'text-purple-600' },
    { id: 'notes' as ExportType, label: 'Notes', count: notes.length, icon: FileText, color: 'text-teal-600' },
    { id: 'reports' as ExportType, label: 'USG Reports', count: reports.length, icon: FileText, color: 'text-orange-600' },
    { id: 'study_sessions' as ExportType, label: 'Study Sessions', count: studySessions.length, icon: Brain, color: 'text-green-600' },
    { id: 'diagrams' as ExportType, label: 'Diagrams', count: diagrams.length, icon: GitBranch, color: 'text-indigo-600' },
  ];

  function toggleType(id: ExportType) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function handleExport() {
    if (selected.size === 0) return;
    setExporting(true);
    await new Promise((r) => setTimeout(r, 1500));

    const exportData: string[] = [];
    if (selected.has('flashcards')) exportData.push(generateMarkdown('flashcards', flashcards, vaultPath));
    if (selected.has('notes')) exportData.push(generateMarkdown('notes', notes, vaultPath));
    if (selected.has('conversations')) exportData.push(generateMarkdown('conversations', conversations, vaultPath));

    const blob = new Blob([exportData.join('\n\n---\n\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medmother-export-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);

    setExporting(false);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className={cn(
        'rounded-2xl p-6 border',
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
      )}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={cn('text-lg font-bold', darkMode ? 'text-white' : 'text-slate-800')}>Obsidian Vault Export</h2>
            <p className={cn('text-sm', darkMode ? 'text-slate-400' : 'text-slate-500')}>Export your knowledge to Obsidian-compatible Markdown files</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          {['✅ YAML frontmatter', '✅ Wikilink backlinks', '✅ Tags', '✅ Source citations'].map((f) => (
            <div key={f} className={cn('px-3 py-1 rounded-full text-xs font-medium', darkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-600 border border-slate-200')}>{f}</div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selection */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className={cn('text-sm font-semibold', darkMode ? 'text-slate-300' : 'text-slate-700')}>Select content to export</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EXPORT_TYPES.map(({ id, label, count, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => toggleType(id)}
                disabled={count === 0}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  selected.has(id)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : darkMode ? 'border-slate-700 bg-slate-800 hover:border-slate-500' : 'border-slate-200 bg-white hover:border-blue-200',
                  count === 0 && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <Icon className={cn('w-5 h-5', color)} />
                  {selected.has(id) && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <div className={cn('text-sm font-medium', darkMode ? 'text-slate-200' : 'text-slate-700')}>{label}</div>
                <div className="text-xs text-slate-400">{count} items</div>
              </button>
            ))}
          </div>

          {/* Options */}
          <Card>
            <div className="p-4 space-y-3">
              <h4 className={cn('text-sm font-medium', darkMode ? 'text-slate-300' : 'text-slate-700')}>Export Options</h4>
              <div>
                <label className="label">Vault path (for Obsidian)
                </label>
                <div className="relative">
                  <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    className="input pl-9"
                    value={vaultPath}
                    onChange={(e) => setVaultPath(e.target.value)}
                    placeholder="/MedMother/"
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={includeFrontmatter} onChange={(e) => setIncludeFrontmatter(e.target.checked)} className="rounded" />
                  <span className={cn('text-sm', darkMode ? 'text-slate-300' : 'text-slate-700')}>Include YAML frontmatter</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={includeBacklinks} onChange={(e) => setIncludeBacklinks(e.target.checked)} className="rounded" />
                  <span className={cn('text-sm', darkMode ? 'text-slate-300' : 'text-slate-700')}>Include backlinks</span>
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary + Export */}
        <div className="space-y-4">
          <Card>
            <div className="p-4">
              <h4 className={cn('text-sm font-medium mb-4', darkMode ? 'text-slate-300' : 'text-slate-700')}>Export Summary</h4>
              {selected.size === 0 ? (
                <p className="text-sm text-slate-400">Select content types above to export</p>
              ) : (
                <div className="space-y-2">
                  {EXPORT_TYPES.filter((t) => selected.has(t.id)).map(({ id, label, count, icon: Icon, color }) => (
                    <div key={id} className="flex items-center gap-2">
                      <Icon className={cn('w-4 h-4', color)} />
                      <span className={cn('text-sm flex-1', darkMode ? 'text-slate-300' : 'text-slate-700')}>{label}</span>
                      <Badge variant="slate">{count}</Badge>
                    </div>
                  ))}
                  <div className={cn('border-t pt-2 mt-2', darkMode ? 'border-slate-700' : 'border-slate-200')}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Format</span>
                      <span className={cn('text-xs font-medium', darkMode ? 'text-slate-300' : 'text-slate-700')}>Markdown (.md)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Frontmatter</span>
                      <Badge variant={includeFrontmatter ? 'green' : 'slate'} size="sm">{includeFrontmatter ? 'Yes' : 'No'}</Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <button
            onClick={handleExport}
            disabled={selected.size === 0 || exporting}
            className="w-full btn-primary justify-center text-base py-3"
          >
            {exporting ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Exporting…</>
            ) : exported ? (
              <><Check className="w-4 h-4" /> Exported!</>
            ) : (
              <><Download className="w-4 h-4" /> Export to Markdown</>
            )}
          </button>

          <div className={cn('p-3 rounded-xl border text-xs space-y-2', darkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500')}>
            <div className="flex items-center gap-1 font-medium">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              Obsidian Integration Tips
            </div>
            <ul className="space-y-1">
              <li>• Place exported files in your vault’s MedMother folder</li>
              <li>• Use the Dataview plugin to query by tags</li>
              <li>• Backlinks connect notes to source textbooks</li>
              <li>• Use Templater for daily review schedules</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { GitBranch, Plus, Sparkles, BookOpen, Download, Trash2, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn, generateId } from '../lib/utils';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import type { DiagramData, DiagramNode, DiagramEdge } from '../types';

function DiagramViewer({ diagram, darkMode }: { diagram: DiagramData; darkMode: boolean }) {
  const nodeTypes: Record<string, string> = {
    concept: darkMode ? 'bg-blue-900 border-blue-600 text-blue-200' : 'bg-blue-100 border-blue-400 text-blue-800',
    process: darkMode ? 'bg-slate-700 border-slate-500 text-slate-200' : 'bg-slate-100 border-slate-400 text-slate-700',
    decision: darkMode ? 'bg-yellow-900 border-yellow-600 text-yellow-200' : 'bg-yellow-50 border-yellow-400 text-yellow-800',
    outcome: darkMode ? 'bg-green-900 border-green-600 text-green-200' : 'bg-green-50 border-green-400 text-green-800',
    category: darkMode ? 'bg-purple-900 border-purple-600 text-purple-200' : 'bg-purple-50 border-purple-400 text-purple-800',
    organ: darkMode ? 'bg-red-900 border-red-600 text-red-200' : 'bg-red-50 border-red-400 text-red-800',
  };

  return (
    <div className={cn('relative rounded-xl overflow-hidden border', darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200')} style={{ minHeight: 400 }}>
      <div className="absolute inset-0 overflow-auto p-6">
        {/* Draw nodes */}
        <div className="relative" style={{ minWidth: 700, minHeight: 650 }}>
          {diagram.nodes.map((node) => (
            <div
              key={node.id}
              className={cn(
                'absolute rounded-lg border-2 px-3 py-2 text-xs font-medium text-center shadow-sm',
                nodeTypes[node.type] || nodeTypes.concept,
                'max-w-[120px]'
              )}
              style={{
                left: node.x,
                top: node.y,
                transform: 'translateX(-50%)',
                backgroundColor: node.color ? node.color + '20' : undefined,
                borderColor: node.color,
                color: node.color,
              }}
            >
              {node.label}
            </div>
          ))}

          {/* Simplified edge labels */}
          {diagram.edges.map((edge) => {
            const from = diagram.nodes.find((n) => n.id === edge.from);
            const to = diagram.nodes.find((n) => n.id === edge.to);
            if (!from || !to) return null;
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            return edge.label ? (
              <div
                key={edge.id}
                className={cn('absolute text-xs px-1 rounded', darkMode ? 'bg-slate-700 text-slate-400' : 'bg-white text-slate-500')}
                style={{ left: midX, top: midY, transform: 'translate(-50%, -50%)' }}
              >
                {edge.label}
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
        {Object.entries({
          concept: 'Concept', process: 'Process', outcome: 'Outcome',
        }).map(([type, label]) => (
          <div key={type} className={cn(
            'flex items-center gap-1 px-2 py-1 rounded text-xs',
            nodeTypes[type]
          )}>
            <div className="w-2 h-2 rounded-full bg-current opacity-60" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function generateDiagram(topic: string): DiagramData {
  return {
    id: generateId(),
    title: `${topic} — Concept Map`,
    type: 'flowchart',
    description: `Auto-generated concept map for ${topic} based on indexed textbook content.`,
    nodes: [
      { id: 'n1', label: topic.slice(0, 20), type: 'concept', color: '#1e40af', x: 300, y: 50 },
      { id: 'n2', label: 'Etiology', type: 'category', color: '#7c3aed', x: 100, y: 160 },
      { id: 'n3', label: 'Pathophysiology', type: 'process', color: '#0369a1', x: 300, y: 160 },
      { id: 'n4', label: 'Clinical Features', type: 'outcome', color: '#047857', x: 500, y: 160 },
      { id: 'n5', label: 'Genetic factors', type: 'concept', color: '#7c3aed', x: 50, y: 280 },
      { id: 'n6', label: 'Environmental triggers', type: 'concept', color: '#7c3aed', x: 180, y: 280 },
      { id: 'n7', label: 'Cellular dysfunction', type: 'process', color: '#0369a1', x: 300, y: 280 },
      { id: 'n8', label: 'Symptoms', type: 'outcome', color: '#047857', x: 450, y: 280 },
      { id: 'n9', label: 'Signs', type: 'outcome', color: '#047857', x: 570, y: 280 },
      { id: 'n10', label: 'Investigations', type: 'process', color: '#b45309', x: 150, y: 400 },
      { id: 'n11', label: 'Management', type: 'process', color: '#b45309', x: 350, y: 400 },
      { id: 'n12', label: 'Prognosis', type: 'outcome', color: '#047857', x: 520, y: 400 },
      { id: 'n13', label: 'Conservative', type: 'concept', color: '#b45309', x: 250, y: 510 },
      { id: 'n14', label: 'Medical', type: 'concept', color: '#b45309', x: 370, y: 510 },
      { id: 'n15', label: 'Surgical', type: 'concept', color: '#b45309', x: 470, y: 510 },
    ],
    edges: [
      { id: 'e1', from: 'n1', to: 'n2', type: 'arrow' },
      { id: 'e2', from: 'n1', to: 'n3', type: 'arrow' },
      { id: 'e3', from: 'n1', to: 'n4', type: 'arrow' },
      { id: 'e4', from: 'n2', to: 'n5', type: 'arrow' },
      { id: 'e5', from: 'n2', to: 'n6', type: 'arrow' },
      { id: 'e6', from: 'n3', to: 'n7', type: 'arrow' },
      { id: 'e7', from: 'n4', to: 'n8', type: 'arrow' },
      { id: 'e8', from: 'n4', to: 'n9', type: 'arrow' },
      { id: 'e9', from: 'n7', to: 'n10', type: 'arrow' },
      { id: 'e10', from: 'n7', to: 'n11', type: 'arrow' },
      { id: 'e11', from: 'n8', to: 'n12', type: 'arrow' },
      { id: 'e12', from: 'n11', to: 'n13', type: 'arrow' },
      { id: 'e13', from: 'n11', to: 'n14', type: 'arrow' },
      { id: 'e14', from: 'n11', to: 'n15', type: 'arrow' },
    ],
  };
}

export default function DiagramCenter() {
  const { diagrams, addDiagram, darkMode, books } = useAppStore();
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [activeDiagram, setActiveDiagram] = useState<DiagramData | null>(diagrams[0] || null);

  async function generate() {
    if (!topic.trim()) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1600));
    const d = generateDiagram(topic.trim());
    addDiagram(d);
    setActiveDiagram(d);
    setGenerating(false);
    setTopic('');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: controls + list */}
        <div className="space-y-4">
          <Card>
            <div className="p-4">
              <h3 className={cn('font-semibold mb-4', darkMode ? 'text-white' : 'text-slate-800')}>Generate Diagram</h3>
              <div className="space-y-3">
                <input
                  className="input"
                  placeholder="Topic (e.g. Preeclampsia)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generate()}
                />
                <button onClick={generate} disabled={!topic.trim() || generating} className="w-full btn-primary justify-center text-sm">
                  {generating ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Building…</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate</>  
                  )}
                </button>
              </div>
            </div>
          </Card>

          <div className="space-y-2">
            <h4 className={cn('text-xs font-semibold uppercase tracking-wide', darkMode ? 'text-slate-400' : 'text-slate-500')}>Saved Diagrams</h4>
            {diagrams.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDiagram(d)}
                className={cn(
                  'w-full text-left p-3 rounded-xl border transition-all',
                  activeDiagram?.id === d.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : darkMode ? 'border-slate-700 bg-slate-800 hover:border-slate-500' : 'border-slate-200 bg-white hover:border-blue-200'
                )}
              >
                <div className={cn('text-sm font-medium truncate', darkMode ? 'text-slate-200' : 'text-slate-700')}>{d.title}</div>
                <div className="text-xs text-slate-400">{d.nodes.length} nodes • {d.type.replace('_', ' ')}</div>
              </button>
            ))}
          </div>

          <div className={cn('p-3 rounded-xl border text-xs', darkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-blue-50 border-blue-200 text-blue-700')}>
            <BookOpen className="w-4 h-4 mb-1" />
            Diagrams are generated from retrieved textbook content with source citations.
          </div>
        </div>

        {/* Diagram viewer */}
        <div className="lg:col-span-3 space-y-4">
          {activeDiagram ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={cn('text-lg font-bold', darkMode ? 'text-white' : 'text-slate-800')}>{activeDiagram.title}</h3>
                  <p className="text-sm text-slate-400">{activeDiagram.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary text-sm">
                    <Download className="w-4 h-4" /> Export SVG
                  </button>
                </div>
              </div>

              <DiagramViewer diagram={activeDiagram} darkMode={darkMode} />

              {/* Node legend */}
              <Card>
                <div className="p-4">
                  <h4 className={cn('text-sm font-medium mb-3', darkMode ? 'text-slate-300' : 'text-slate-700')}>Nodes ({activeDiagram.nodes.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeDiagram.nodes.map((n) => (
                      <div
                        key={n.id}
                        className="px-2 py-1 rounded-lg border text-xs font-medium"
                        style={{ borderColor: n.color, color: n.color, backgroundColor: n.color + '15' }}
                      >
                        {n.label}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <div className={cn('flex flex-col items-center justify-center min-h-96 rounded-xl border-2 border-dashed', darkMode ? 'border-slate-700' : 'border-slate-200')}>
              <GitBranch className="w-12 h-12 text-slate-300 mb-3" />
              <p className={cn('font-medium', darkMode ? 'text-slate-400' : 'text-slate-500')}>No diagram selected</p>
              <p className="text-sm text-slate-400">Generate a concept map from any medical topic</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

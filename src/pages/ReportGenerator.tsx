import { useState } from 'react';
import {
  FileText, Sparkles, Save, Download, Bookmark, BookmarkCheck,
  Copy, Check, AlertTriangle, ChevronDown, Plus, Trash2
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn, USG_TEMPLATE_LABELS, generateId, formatDate } from '../lib/utils';
import type { USGReport, USGTemplate, USGReportSection, USGReportField } from '../types';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const TEMPLATES: { id: USGTemplate; sections: string[] }[] = [
  {
    id: 'obstetric_1st_trimester',
    sections: ['Clinical Indication', 'Technique', 'Fetal Viability', 'Biometry', 'Nuchal Translucency', 'Fetal Anatomy', 'Uterus & Adnexa', 'Impression', 'Recommendation'],
  },
  {
    id: 'obstetric_2nd_3rd_trimester',
    sections: ['Clinical Indication', 'Technique', 'Fetal Lie & Presentation', 'Fetal Heart Rate', 'Biometry', 'Amniotic Fluid', 'Placenta', 'Fetal Anatomy Survey', 'Doppler', 'Impression', 'Recommendation'],
  },
  {
    id: 'gynecological',
    sections: ['Clinical Indication', 'Technique', 'Uterus', 'Endometrium', 'Ovaries', 'Adnexa & POD', 'Cervix', 'Impression', 'Recommendation'],
  },
  {
    id: 'abdominal',
    sections: ['Clinical Indication', 'Technique', 'Liver', 'Gallbladder & Bile Ducts', 'Spleen', 'Pancreas', 'Kidneys', 'Aorta', 'Lymph Nodes', 'Impression', 'Recommendation'],
  },
  {
    id: 'thyroid',
    sections: ['Clinical Indication', 'Technique', 'Right Lobe', 'Left Lobe', 'Isthmus', 'Nodules', 'Lymph Nodes', 'TIRADS Classification', 'Impression', 'Recommendation'],
  },
];

const PLACEHOLDER_MAP: Record<string, string> = {
  'Clinical Indication': 'e.g. Dating scan, growth assessment, anomaly screening...',
  'Technique': 'e.g. Real-time B-mode ultrasonography using 3.5-5 MHz curvilinear transducer...',
  'Fetal Viability': 'e.g. Single/multiple live intrauterine fetus. Fetal cardiac activity confirmed at ___ bpm.',
  'Biometry': 'BPD: ___ mm, HC: ___ mm, AC: ___ mm, FL: ___ mm. EGA by biometry: ___ weeks ___ days.',
  'Nuchal Translucency': 'NT: ___ mm (normal <3.5mm for GA). Nasal bone: present/absent.',
  'Amniotic Fluid': 'AFI: ___ cm / MVP: ___ cm. (Normal AFI 8-24 cm).',
  'Placenta': 'Anterior/Posterior/Fundal, Grade ___, ___ cm from internal os.',
  'Impression': 'Summarize key findings in numbered list...',
  'Recommendation': 'Follow-up recommendations...',
  'Liver': 'Size: ___ cm (normal <15 cm). Echotexture: homogeneous/heterogeneous. No focal lesion.',
  'Gallbladder & Bile Ducts': 'GB: Distended/contracted, wall thickness ___ mm. CBD: ___ mm. No calculi.',
  'Uterus': 'Size: ___ x ___ x ___ cm (AP x TR x CC). Position: anteverted/retroverted. Echotexture: homogeneous.',
  'Endometrium': 'Thickness: ___ mm. Appearance: proliferative/secretory/atrophic.',
  'Ovaries': 'Right: ___ x ___ x ___ cm, volume ___ cc. Left: ___ x ___ x ___ cm, volume ___ cc.',
};

function generateReport(template: USGTemplate, sections: USGReportSection[]): string {
  const title = USG_TEMPLATE_LABELS[template]?.toUpperCase() || 'ULTRASONOGRAPHY REPORT';
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  let report = `${title}\nDate: ${date}\n\n`;
  sections.forEach((s) => {
    if (s.generated?.trim()) {
      report += `${s.title.toUpperCase()}:\n${s.generated}\n\n`;
    }
  });
  report += `DISCLAIMER: This report has been generated with AI assistance based on findings entered by the clinician and textbook-based terminology. It is intended for educational and drafting purposes only. The final report must be reviewed, verified, and signed by the responsible clinician/radiologist before clinical use. This report does not constitute a standalone medical diagnosis.`;
  return report;
}

export default function ReportGenerator() {
  const { reports, addReport, updateReport, toggleBookmarkReport, darkMode } = useAppStore();
  const [selectedTemplate, setSelectedTemplate] = useState<USGTemplate>('obstetric_2nd_3rd_trimester');
  const [sections, setSections] = useState<USGReportSection[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState('');
  const [activeReport, setActiveReport] = useState<USGReport | null>(reports[0] || null);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'new' | 'list' | 'view'>('list');

  const templateData = TEMPLATES.find((t) => t.id === selectedTemplate);

  function initSections(template: USGTemplate) {
    const t = TEMPLATES.find((x) => x.id === template);
    if (!t) return;
    setSections(t.sections.map((title, i) => ({
      id: `s${i}`,
      title,
      fields: [],
      generated: '',
    })));
  }

  function updateSection(id: string, generated: string) {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, generated } : s));
  }

  async function handleGenerate() {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    const text = generateReport(selectedTemplate, sections);
    setGeneratedReport(text);
    setGenerating(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(activeReport?.generatedReport || generatedReport || '').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSave() {
    const report: USGReport = {
      id: generateId(),
      userId: 'u1',
      template: selectedTemplate,
      templateLabel: USG_TEMPLATE_LABELS[selectedTemplate] || '',
      sections,
      generatedReport,
      status: generatedReport ? 'complete' : 'draft',
      bookmarked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addReport(report);
    setActiveReport(report);
    setView('view');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {(['list', 'new'] as const).map((v) => (
            <button
              key={v}
              onClick={() => { setView(v); if (v === 'new') initSections(selectedTemplate); }}
              className={cn('btn text-sm', view === v ? 'btn-primary' : 'btn-secondary')}
            >
              {v === 'new' ? <><Plus className="w-4 h-4" /> New Report</> : 'All Reports'}
            </button>
          ))}
        </div>
      </div>

      {view === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.length === 0 ? (
            <div className="col-span-3 text-center py-16">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No reports yet</p>
              <button onClick={() => { setView('new'); initSections(selectedTemplate); }} className="mt-3 btn-primary text-sm">
                Create first report
              </button>
            </div>
          ) : reports.map((r) => (
            <button
              key={r.id}
              onClick={() => { setActiveReport(r); setView('view'); }}
              className="card p-4 text-left hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <Badge variant={r.status === 'complete' ? 'green' : 'orange'}>{r.status}</Badge>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleBookmarkReport(r.id); }}
                  className="text-slate-300 hover:text-amber-500 transition-colors"
                >
                  {r.bookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>
              <div className={cn('font-medium text-sm mb-1', darkMode ? 'text-slate-200' : 'text-slate-800')}>{r.templateLabel}</div>
              <div className="text-xs text-slate-400">{formatDate(r.createdAt)}</div>
              {r.generatedReport && (
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {r.generatedReport.slice(0, 120)}…
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {view === 'new' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: template + sections */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <div className="p-4">
                <label className="label">Report Template</label>
                <select
                  className="input"
                  value={selectedTemplate}
                  onChange={(e) => {
                    const t = e.target.value as USGTemplate;
                    setSelectedTemplate(t);
                    initSections(t);
                    setGeneratedReport('');
                  }}
                >
                  {Object.entries(USG_TEMPLATE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                {sections.length === 0 && (
                  <button
                    onClick={() => initSections(selectedTemplate)}
                    className="mt-2 btn-secondary text-sm w-full justify-center"
                  >
                    Load Template Sections
                  </button>
                )}
              </div>
            </Card>

            <div className="space-y-3">
              {sections.map((section) => (
                <Card key={section.id} padding="none">
                  <div className="p-4">
                    <label className={cn('text-sm font-medium mb-2 block', darkMode ? 'text-slate-300' : 'text-slate-700')}>
                      {section.title}
                    </label>
                    <textarea
                      className="input resize-none"
                      rows={section.title === 'Impression' || section.title === 'Technique' ? 4 : 2}
                      placeholder={PLACEHOLDER_MAP[section.title] || `Enter ${section.title.toLowerCase()} findings...`}
                      value={section.generated || ''}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={handleGenerate} disabled={generating || sections.length === 0} className="btn-primary">
                {generating ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate Report</>
                )}
              </button>
              {generatedReport && (
                <button onClick={handleSave} className="btn-secondary">
                  <Save className="w-4 h-4" /> Save Report
                </button>
              )}
            </div>
          </div>

          {/* Right: preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className={cn('text-sm font-semibold', darkMode ? 'text-slate-300' : 'text-slate-700')}>Report Preview</h3>
                {generatedReport && (
                  <button onClick={handleCopy} className="btn-ghost text-xs">
                    {copied ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                )}
              </div>
              <Card className={cn('min-h-64 overflow-auto', !generatedReport && 'flex items-center justify-center')}>
                {generatedReport ? (
                  <pre className={cn('text-xs leading-relaxed p-4 whitespace-pre-wrap font-mono', darkMode ? 'text-slate-300' : 'text-slate-700')}>
                    {generatedReport}
                  </pre>
                ) : (
                  <div className="text-center p-8">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Fill in findings and click Generate</p>
                  </div>
                )}
              </Card>
              <div className={cn('mt-3 p-3 rounded-xl border flex gap-2 text-xs', darkMode ? 'bg-amber-950/30 border-amber-800 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-700')}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                This AI-assisted draft requires clinician review before clinical use.
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'view' && activeReport && (
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('list')} className="btn-ghost text-sm">← Back</button>
            <Badge variant={activeReport.status === 'complete' ? 'green' : 'orange'}>{activeReport.status}</Badge>
            <div className="ml-auto flex gap-2">
              <button onClick={handleCopy} className="btn-secondary text-sm">
                {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
              </button>
              <button onClick={() => toggleBookmarkReport(activeReport.id)} className="btn-secondary text-sm">
                {activeReport.bookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-500" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Card>
            <pre className={cn('text-sm leading-relaxed p-6 whitespace-pre-wrap font-mono', darkMode ? 'text-slate-300' : 'text-slate-700')}>
              {activeReport.generatedReport}
            </pre>
          </Card>
          <div className={cn('p-4 rounded-xl border flex gap-2 text-sm', darkMode ? 'bg-amber-950/30 border-amber-800 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-700')}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p><strong>Clinical Disclaimer:</strong> This report is AI-assisted and generated from textbook-based templates. It must be reviewed and authorized by the responsible clinician or radiologist before clinical use. Do not use as a standalone diagnostic report.</p>
          </div>
        </div>
      )}
    </div>
  );
}

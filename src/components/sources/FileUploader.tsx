import { useState, useCallback } from 'react';
import { Upload, FileText, X, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

const ACCEPTED = '.pdf,.txt,.md,.docx,.doc';
const MAX_SIZE_MB = 10;

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.readAsText(file);
  });
}

export default function FileUploader() {
  const { addSource, addMemory } = useAppStore();
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<Array<{ file: File; status: 'pending' | 'uploading' | 'done' | 'error' }>>([]);

  const processFile = useCallback(async (file: File) => {
    setFiles((prev) => [...prev, { file, status: 'uploading' }]);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const content = file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')
      ? await readFileAsText(file)
      : `[Content of ${file.name} — processed by MemoryOS. In a live environment, full text extraction would appear here.]`;

    const source = addSource({
      source_type: 'upload',
      title: file.name,
      raw_content: content,
      file_type: file.type,
      file_size: file.size,
    });

    // Auto-create a memory from the upload
    addMemory({
      title: `Imported: ${file.name}`,
      content: content.slice(0, 400) + (content.length > 400 ? '…' : ''),
      tags: ['upload'],
      source_document_id: source.id,
      timestamp: new Date().toISOString(),
      privacy_level: 'private',
      pinned: false,
    });

    setFiles((prev) =>
      prev.map((f) => (f.file === file ? { ...f, status: 'done' } : f))
    );
    toast.success(`Imported ${file.name}`);
  }, [addSource, addMemory]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    Array.from(e.dataTransfer.files).forEach((file) => {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} is too large (max ${MAX_SIZE_MB}MB)`);
        return;
      }
      processFile(file);
    });
  }, [processFile]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach((file) => processFile(file));
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all',
          dragging
            ? 'border-brand-400 bg-brand-50'
            : 'border-gray-200 bg-surface-50 hover:border-gray-300 hover:bg-gray-50'
        )}
      >
        <input
          type="file"
          multiple
          accept={ACCEPTED}
          onChange={handleInput}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <Upload className={cn('w-8 h-8 mx-auto mb-3', dragging ? 'text-brand-500' : 'text-gray-400')} />
        <p className="text-sm font-medium text-gray-700 mb-1">
          {dragging ? 'Drop files here' : 'Drop files or click to upload'}
        </p>
        <p className="text-xs text-gray-400">PDF, TXT, MD, DOCX · max {MAX_SIZE_MB}MB per file</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(({ file, status }, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-card">
              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
                <p className="text-[11px] text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              {status === 'uploading' && (
                <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              )}
              {status === 'done' && <Check className="w-4 h-4 text-emerald-500" />}
              {status === 'error' && <X className="w-4 h-4 text-red-500" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

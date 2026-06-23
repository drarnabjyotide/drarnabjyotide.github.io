import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import type { Memory } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { DEMO_TAGS } from '../../lib/seedData';
import { TAG_COLORS } from '../../lib/utils';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  memory?: Memory | null;
}

const PRIVACY_OPTIONS = [
  { value: 'private', label: 'Private', desc: 'Only you can see this' },
  { value: 'sensitive', label: 'Sensitive', desc: 'Hidden by default, extra warning' },
  { value: 'public', label: 'Public', desc: 'Shareable with others' },
] as const;

export default function MemoryEditor({ open, onClose, memory }: Props) {
  const { addMemory, updateMemory, sources } = useAppStore();
  const isEdit = !!memory;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<'private' | 'public' | 'sensitive'>('private');
  const [sourceId, setSourceId] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (memory) {
      setTitle(memory.title);
      setContent(memory.content);
      setTags(memory.tags);
      setPrivacy(memory.privacy_level);
      setSourceId(memory.source_document_id || '');
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setPrivacy('private');
      setSourceId('');
    }
  }, [memory, open]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    const base = {
      title: title.trim(),
      content: content.trim(),
      tags,
      privacy_level: privacy,
      source_document_id: sourceId || undefined,
      timestamp: memory?.timestamp || new Date().toISOString(),
      pinned: memory?.pinned || false,
    };
    if (isEdit && memory) {
      updateMemory(memory.id, base);
      toast.success('Memory updated');
    } else {
      addMemory(base);
      toast.success('Memory saved');
    }
    onClose();
  };

  const toggleTag = (name: string) => {
    setTags((t) => t.includes(name) ? t.filter((x) => x !== name) : [...t, name]);
  };

  const addCustomTag = () => {
    const t = newTag.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setNewTag('');
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit memory' : 'New memory'} size="lg">
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give this memory a clear title..."
            className="w-full px-3.5 py-2.5 bg-surface-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the content of this memory..."
            rows={6}
            className="w-full px-3.5 py-2.5 bg-surface-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 resize-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {DEMO_TAGS.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.name)}
                className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all border ${
                  tags.includes(tag.name) ? 'border-transparent' : 'border-gray-200 text-gray-500'
                }`}
                style={tags.includes(tag.name) ? { backgroundColor: `${tag.color}22`, color: tag.color, borderColor: `${tag.color}44` } : {}}
              >
                {tag.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
              placeholder="Add custom tag..."
              className="flex-1 px-3 py-1.5 bg-surface-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            <button
              onClick={addCustomTag}
              className="px-3 py-1.5 bg-brand-50 text-brand-600 text-xs font-medium rounded-xl hover:bg-brand-100 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Privacy</label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as typeof privacy)}
              className="w-full px-3 py-2.5 bg-surface-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              {PRIVACY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Source</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full px-3 py-2.5 bg-surface-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="">None</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors"
          >
            {isEdit ? 'Save changes' : 'Save memory'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

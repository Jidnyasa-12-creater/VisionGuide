import { useEffect, useState } from 'react';
import { Header } from '../components/Layout/Header';
import { getMemory, saveMemory, deleteMemory } from '../api/client';
import { Brain, Plus, Trash2, Tag } from 'lucide-react';
import type { Memory } from '../types';

const categories = ['general', 'places', 'people', 'preferences', 'reminders', 'personal'];

export function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try { const d = await getMemory(); setMemories(d.memories); } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!key.trim() || !value.trim()) return;
    setLoading(true);
    try {
      await saveMemory(key.trim(), value.trim(), category);
      setKey(''); setValue(''); setCategory('general');
      await load();
    } finally { setLoading(false); }
  };

  const handleDelete = async (k: string) => {
    try { await deleteMemory(k); await load(); } catch {}
  };

  const catColors: Record<string,string> = {
    general: 'bg-slate-600', places: 'bg-teal-600', people: 'bg-pink-600',
    preferences: 'bg-purple-600', reminders: 'bg-orange-600', personal: 'bg-blue-600',
  };

  return (
    <div>
      <Header title="Memory" subtitle="Store and recall important information" />
      <div className="p-6 max-w-4xl mx-auto grid lg:grid-cols-2 gap-6">
        {/* Add memory */}
        <div className="card flex flex-col gap-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Plus size={16} className="text-primary-400" /> Add Memory
          </h3>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Key (what to remember)</label>
            <input value={key} onChange={e=>setKey(e.target.value)} placeholder="e.g. My keys location"
              className="w-full bg-surface-700 border border-surface-600 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Value</label>
            <textarea value={value} onChange={e=>setValue(e.target.value)} rows={2} placeholder="e.g. On the kitchen counter near the microwave"
              className="w-full bg-surface-700 border border-surface-600 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Category</label>
            <select value={category} onChange={e=>setCategory(e.target.value)}
              className="w-full bg-surface-700 border border-surface-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
            </select>
          </div>
          <button onClick={handleSave} disabled={loading || !key || !value} className="btn-primary">
            {loading ? 'Saving…' : 'Save Memory'}
          </button>
        </div>

        {/* Memory list */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Brain size={16} className="text-primary-400" /> Stored Memories ({memories.length})
          </h3>
          {memories.length === 0 && (
            <div className="card text-center py-8">
              <Brain size={36} className="text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No memories saved yet.</p>
            </div>
          )}
          {memories.map(m => (
            <div key={m.id} className="card flex items-start gap-3">
              <span className={`badge ${catColors[m.category] || 'bg-slate-600'} text-white mt-1 flex-shrink-0`}>
                {m.category}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{m.key}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{m.value}</p>
              </div>
              <button onClick={() => handleDelete(m.key)}
                className="p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

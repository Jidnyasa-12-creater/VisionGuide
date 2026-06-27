import { useEffect, useState } from 'react';
import { Header } from '../components/Layout/Header';
import { getHistory } from '../api/client';
import { Trash2, Clock, Search, FileText, Scan, Coins, Shirt, Navigation, Eye } from 'lucide-react';
import type { HistoryRecord } from '../types';

const typeIcons: Record<string, any> = {
  scene: Eye, objects: Scan, ocr: FileText,
  currency: Coins, clothing: Shirt, navigation: Navigation, gestures: Eye,
};

const typeColors: Record<string, string> = {
  scene: 'text-blue-400', objects: 'text-yellow-400', ocr: 'text-red-400',
  currency: 'text-amber-400', clothing: 'text-pink-400', navigation: 'text-teal-400', gestures: 'text-purple-400',
};

export function ConversationHistory() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getHistory('default');
      setRecords(data.records);
    } catch { setRecords([]); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? records : records.filter(r => r.type === filter);

  return (
    <div>
      <Header title="Analysis History" subtitle="Review past AI analyses" />
      <div className="p-6 max-w-4xl mx-auto">
        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all','scene','objects','ocr','currency','clothing','navigation'].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all
                ${filter===t ? 'bg-primary-600 text-white' : 'bg-surface-700 text-slate-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {loading && <p className="text-slate-400 text-sm">Loading history…</p>}
        {!loading && filtered.length === 0 && (
          <div className="card text-center py-12">
            <Clock size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No history yet. Start analyzing to see results here.</p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map(r => {
            const Icon = typeIcons[r.type] || Eye;
            const color = typeColors[r.type] || 'text-slate-400';
            return (
              <div key={r.id} className="card hover:border-surface-600 transition-colors">
                <div className="flex items-start gap-3">
                  <Icon size={18} className={`${color} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold uppercase ${color}`}>{r.type}</span>
                      <span className="text-xs text-slate-500">
                        {new Date(r.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">{r.result}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

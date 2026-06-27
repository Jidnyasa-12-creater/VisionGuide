import { Volume2, Loader2, AlertCircle } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

interface ResultBoxProps {
  result: string;
  loading?: boolean;
  error?: string;
  label?: string;
}

export function ResultBox({ result, loading, error, label = 'AI Response' }: ResultBoxProps) {
  const { speak } = useSpeech();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</span>
        {result && !loading && (
          <button
            onClick={() => speak(result)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-surface-700 transition-colors"
            aria-label="Read aloud"
            title="Read aloud"
          >
            <Volume2 size={16} />
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 size={20} className="animate-spin" />
          <span>Analyzing… please wait</span>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-start gap-2 text-red-400 text-sm">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && !loading && !error && (
        <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">{result}</p>
      )}

      {!result && !loading && !error && (
        <p className="text-slate-500 text-sm italic">Awaiting your command…</p>
      )}
    </div>
  );
}

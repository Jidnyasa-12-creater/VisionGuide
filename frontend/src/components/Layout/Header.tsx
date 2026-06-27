import { Menu, Eye, VolumeX } from 'lucide-react';
import { useAppStore } from '../../store';
import { useSpeech } from '../../hooks/useSpeech';

interface HeaderProps { title: string; subtitle?: string; }

export function Header({ title, subtitle }: HeaderProps) {
  const { sidebarOpen, setSidebarOpen, highContrast, toggleHighContrast, largeText, toggleLargeText } = useAppStore();
  const { stopSpeaking } = useSpeech();

  return (
    <header className="sticky top-0 z-10 bg-surface-800/80 backdrop-blur-md border-b border-surface-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">{title}</h1>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Stop speaking */}
        <button
          onClick={stopSpeaking}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-colors"
          aria-label="Stop speaking"
          title="Stop speaking"
        >
          <VolumeX size={18} />
        </button>

        {/* High contrast */}
        <button
          onClick={toggleHighContrast}
          className={`p-2 rounded-lg transition-colors ${highContrast ? 'bg-yellow-500 text-black' : 'text-slate-400 hover:text-white hover:bg-surface-700'}`}
          aria-label="Toggle high contrast"
          title="High contrast"
        >
          <Eye size={18} />
        </button>

        {/* Large text */}
        <button
          onClick={toggleLargeText}
          className={`p-2 rounded-lg transition-colors font-bold text-sm ${largeText ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white hover:bg-surface-700'}`}
          aria-label="Toggle large text"
          title="Large text"
        >
          Aa
        </button>
      </div>
    </header>
  );
}

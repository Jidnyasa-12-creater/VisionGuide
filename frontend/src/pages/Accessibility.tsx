import { Header } from '../components/Layout/Header';
import { useAppStore } from '../store';
import { Eye, Type, Volume2, Moon, Sun, Contrast } from 'lucide-react';

export function AccessibilityPage() {
  const { highContrast, toggleHighContrast, largeText, toggleLargeText, speechRate, setSpeechRate } = useAppStore();

  return (
    <div>
      <Header title="Accessibility" subtitle="Customize for your visual and hearing needs" />
      <div className="p-6 max-w-2xl mx-auto space-y-4">

        {/* High Contrast */}
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Contrast size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="font-semibold text-white">High Contrast Mode</p>
              <p className="text-xs text-slate-400">Increases contrast for better visibility</p>
            </div>
          </div>
          <button onClick={toggleHighContrast}
            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${highContrast ? 'bg-primary-600' : 'bg-surface-600'}`}
            role="switch" aria-checked={highContrast}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${highContrast ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>

        {/* Large Text */}
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Type size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Large Text Mode</p>
              <p className="text-xs text-slate-400">Increases font size by 18% throughout the app</p>
            </div>
          </div>
          <button onClick={toggleLargeText}
            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${largeText ? 'bg-primary-600' : 'bg-surface-600'}`}
            role="switch" aria-checked={largeText}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${largeText ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>

        {/* Speech Rate */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Volume2 size={20} className="text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Text-to-Speech Rate</p>
              <p className="text-xs text-slate-400">Controls how fast the AI speaks (current: {speechRate.toFixed(1)}x)</p>
            </div>
          </div>
          <input type="range" min="0.5" max="2" step="0.1" value={speechRate}
            onChange={e => setSpeechRate(parseFloat(e.target.value))}
            className="w-full accent-primary-500" />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Slow (0.5x)</span><span>Normal (1.0x)</span><span>Fast (2.0x)</span>
          </div>
        </div>

        {/* Android Accessibility Service note */}
        <div className="card border-amber-500/30 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <Eye size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300 mb-1">Android Accessibility Service</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                To enable screen reading and UI element description on Android, enable the
                <strong className="text-white"> VisionGuide Accessibility Service</strong> in:
                <br />Settings → Accessibility → Installed Apps → VisionGuide AI → Enable
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Note: Requires the native Android app (React Native). The web app uses browser-based speech synthesis instead.
              </p>
            </div>
          </div>
        </div>

        {/* Screen reader hint */}
        <div className="card border-primary-500/30 bg-primary-500/5">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-primary-400">Screen Reader Tip:</strong> All buttons have aria-labels for screen reader compatibility.
            Use your device's built-in screen reader (TalkBack on Android, VoiceOver on iOS) alongside VisionGuide for the best experience.
          </p>
        </div>
      </div>
    </div>
  );
}

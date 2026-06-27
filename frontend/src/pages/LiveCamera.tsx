import { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { CameraCapture } from '../components/Camera/CameraCapture';
import { ResultBox } from '../components/UI/ResultBox';
import { VoiceButton } from '../components/Voice/VoiceButton';
import { analyzeImage, sendVoiceCommand } from '../api/client';
import { useSpeech } from '../hooks/useSpeech';
import { Camera, Search, Scan, FileText, Coins, Shirt, Navigation } from 'lucide-react';

const modes = [
  { key: 'scene',      label: 'Describe Scene',   icon: Search },
  { key: 'objects',    label: 'Detect Objects',   icon: Scan },
  { key: 'ocr',        label: 'Read Text',        icon: FileText },
  { key: 'currency',   label: 'Currency',         icon: Coins },
  { key: 'clothing',   label: 'Clothing',         icon: Shirt },
  { key: 'navigation', label: 'Navigate',         icon: Navigation },
];

export function LiveCamera() {
  const [mode, setMode] = useState('scene');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { speak } = useSpeech();

  const handleCapture = async (blob: Blob) => {
    setLoading(true); setResult(''); setError('');
    try {
      const data = await analyzeImage(blob, mode);
      setResult(data.result);
      speak(data.result);
    } catch {
      setError('Could not connect to backend. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleVoice = async (text: string) => {
    setLoading(true); setError('');
    try {
      const data = await sendVoiceCommand(text);
      setResult(data.response);
      speak(data.response);
    } catch {
      setError('Voice command failed. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Live Camera" subtitle="Point camera and analyze your surroundings" />
      <div className="p-6 max-w-4xl mx-auto grid lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <CameraCapture onCapture={handleCapture} label={`Capture & ${modes.find(m=>m.key===mode)?.label}`} />
          {/* Mode selector */}
          <div className="card">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Analysis Mode</p>
            <div className="grid grid-cols-3 gap-2">
              {modes.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-all
                    ${mode === key ? 'bg-primary-600 text-white' : 'bg-surface-700 text-slate-400 hover:text-white hover:bg-surface-600'}`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <ResultBox result={result} loading={loading} error={error} label="AI Analysis" />
          <div className="card flex flex-col items-center gap-3">
            <p className="text-xs text-slate-400 uppercase tracking-widest">Voice Command</p>
            <VoiceButton onResult={handleVoice} size="lg" />
            <p className="text-xs text-slate-500 text-center">Say "describe the scene", "detect objects", "read text", etc.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

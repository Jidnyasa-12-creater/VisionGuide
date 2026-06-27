import { useState, type ReactNode } from 'react';
import { Header } from '../Layout/Header';
import { CameraCapture } from '../Camera/CameraCapture';
import { ResultBox } from './ResultBox';
import { VoiceButton } from '../Voice/VoiceButton';
import { analyzeImage, sendVoiceCommand } from '../../api/client';
import { useSpeech } from '../../hooks/useSpeech';

interface AnalysisPageProps {
  title: string;
  subtitle: string;
  analysisType: string;
  tips?: string[];
  extra?: ReactNode;
}

export function AnalysisPage({ title, subtitle, analysisType, tips = [], extra }: AnalysisPageProps) {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { speak } = useSpeech();

  const run = async (blob: Blob) => {
    setLoading(true); setResult(''); setError('');
    try {
      const data = await analyzeImage(blob, analysisType);
      setResult(data.result);
      speak(data.result);
    } catch {
      setError('Backend connection failed. Start the server with: uvicorn main:app --reload');
    } finally { setLoading(false); }
  };

  const handleVoice = async (text: string) => {
    setLoading(true); setError('');
    try {
      const data = await sendVoiceCommand(text);
      setResult(data.response);
      speak(data.response);
    } catch {
      setError('Voice command failed.');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <Header title={title} subtitle={subtitle} />
      <div className="p-6 max-w-4xl mx-auto grid lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <CameraCapture onCapture={run} label={`Capture & ${title}`} />
          {tips.length > 0 && (
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Tips</p>
              <ul className="space-y-1.5">
                {tips.map((t, i) => (
                  <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                    <span className="text-primary-400 mt-0.5">•</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {extra}
        </div>
        <div className="flex flex-col gap-4">
          <ResultBox result={result} loading={loading} error={error} label={`${title} Result`} />
          <div className="card flex flex-col items-center gap-3">
            <p className="text-xs text-slate-400 uppercase tracking-widest">Voice Command</p>
            <VoiceButton onResult={handleVoice} size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

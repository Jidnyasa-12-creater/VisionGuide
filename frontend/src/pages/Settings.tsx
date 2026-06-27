import { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { useAppStore } from '../store';
import { Settings as SettingsIcon, Globe, User, Server } from 'lucide-react';
import { updateSettings } from '../api/client';

const languages = [
  { code: 'en', label: 'English' }, { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' }, { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' }, { code: 'ar', label: 'Arabic' },
  { code: 'zh', label: 'Chinese' }, { code: 'ta', label: 'Tamil' },
];

export function SettingsPage() {
  const { theme, setTheme } = useAppStore();
  const [language, setLanguage] = useState('en');
  const [userId, setUserId] = useState('default');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await updateSettings({ language, theme: theme === 'dark' ? 'dark' : 'light' }, userId);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  return (
    <div>
      <Header title="Settings" subtitle="Configure VisionGuide AI" />
      <div className="p-6 max-w-2xl mx-auto space-y-4">

        {/* User */}
        <div className="card">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
            <User size={16} className="text-primary-400" /> User Profile
          </h3>
          <label className="text-xs text-slate-400 mb-1 block">User ID (session identifier)</label>
          <input value={userId} onChange={e=>setUserId(e.target.value)}
            className="w-full bg-surface-700 border border-surface-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        {/* Language */}
        <div className="card">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
            <Globe size={16} className="text-primary-400" /> Language
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {languages.map(l => (
              <button key={l.code} onClick={() => setLanguage(l.code)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all
                  ${language===l.code ? 'bg-primary-600 text-white' : 'bg-surface-700 text-slate-400 hover:text-white'}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="card">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
            <SettingsIcon size={16} className="text-primary-400" /> Theme
          </h3>
          <div className="flex gap-3">
            <button onClick={() => setTheme('dark')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${theme==='dark' ? 'bg-surface-900 border-2 border-primary-500 text-white' : 'bg-surface-700 text-slate-400'}`}>
              🌙 Dark
            </button>
            <button onClick={() => setTheme('light')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${theme==='light' ? 'bg-white text-gray-900 border-2 border-primary-500' : 'bg-surface-700 text-slate-400'}`}>
              ☀️ Light
            </button>
          </div>
        </div>

        {/* API */}
        <div className="card">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
            <Server size={16} className="text-primary-400" /> API Configuration
          </h3>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex justify-between py-2 border-b border-surface-700">
              <span>Backend URL</span>
              <span className="text-green-400 font-mono">http://localhost:8000</span>
            </div>
            <div className="flex justify-between py-2 border-b border-surface-700">
              <span>MCP Server URL</span>
              <span className="text-green-400 font-mono">http://localhost:8001</span>
            </div>
            <div className="flex justify-between py-2">
              <span>AI Mode</span>
              <span className="text-yellow-400">Demo (No API Key)</span>
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary w-full">
          {saved ? '✓ Settings Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

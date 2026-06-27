import { Link } from 'react-router-dom';
import {
  Camera, MessageSquare, Search, Scan, FileText,
  Coins, Shirt, Navigation, History, Brain,
  Accessibility, Settings, Activity,
  Zap, Eye, Sparkles
} from 'lucide-react';
import { Header } from '../components/Layout/Header';

const features = [
  { to: '/camera',      icon: Camera,        label: 'Live Camera',       color: 'from-blue-500 to-cyan-500',   desc: 'Real-time camera feed and capture' },
  { to: '/assistant',   icon: MessageSquare, label: 'AI Assistant',      color: 'from-purple-500 to-pink-500', desc: 'Chat with your AI companion' },
  { to: '/scene',       icon: Search,        label: 'Scene Description', color: 'from-green-500 to-emerald-500', desc: 'Understand your surroundings' },
  { to: '/objects',     icon: Scan,          label: 'Object Detection',  color: 'from-yellow-500 to-orange-500', desc: 'Detect and locate objects' },
  { to: '/ocr',         icon: FileText,      label: 'Read Text',         color: 'from-red-500 to-rose-500',    desc: 'Extract text from images' },
  { to: '/currency',    icon: Coins,         label: 'Currency',          color: 'from-amber-500 to-yellow-500', desc: 'Identify bills and coins' },
  { to: '/clothing',    icon: Shirt,         label: 'Clothing',          color: 'from-pink-500 to-fuchsia-500', desc: 'Analyze clothing and style' },
  { to: '/navigation',  icon: Navigation,    label: 'Navigation',        color: 'from-teal-500 to-cyan-600',   desc: 'Safe path guidance' },
  { to: '/history',     icon: History,       label: 'History',           color: 'from-slate-500 to-slate-600', desc: 'View past analyses' },
  { to: '/memory',      icon: Brain,         label: 'Memory',            color: 'from-indigo-500 to-violet-500', desc: 'Store important information' },
  { to: '/accessibility', icon: Accessibility, label: 'Accessibility',  color: 'from-orange-500 to-red-500',  desc: 'Vision and hearing aids' },
  { to: '/settings',    icon: Settings,      label: 'Settings',          color: 'from-gray-500 to-slate-500',  desc: 'Customize your experience' },
];

export function Dashboard() {
  return (
    <div>
      <Header title="VisionGuide AI" subtitle="Your AI accessibility companion" />
      <div className="p-6 max-w-6xl mx-auto">

        {/* Hero */}
        <div className="card-glass mb-8 text-center py-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-xl glow">
              <Sparkles size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-2">Welcome to VisionGuide AI</h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
            An intelligent accessibility assistant for visually impaired users.
            Powered by AI — describe scenes, detect objects, read text, navigate safely, and more.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              <Activity size={14} className="animate-pulse" /> AI Engine Active
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm">
              <Zap size={14} /> Demo Mode
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm">
              <Eye size={14} /> Accessibility First
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map(({ to, icon: Icon, label, color, desc }) => (
            <Link
              key={to}
              to={to}
              className="feature-card flex flex-col gap-3"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick start */}
        <div className="mt-8 card">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Zap size={16} className="text-primary-400" /> Quick Start
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-slate-400">
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <span>Open <strong className="text-white">Live Camera</strong> and grant camera access</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <span>Point your camera at anything and tap <strong className="text-white">Capture & Analyze</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <span>Hear the <strong className="text-white">AI description</strong> read aloud automatically</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

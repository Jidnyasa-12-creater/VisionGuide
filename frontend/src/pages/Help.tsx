import { Header } from '../components/Layout/Header';
import { HelpCircle, Book, MessageSquare, Camera, Mic, Server, Github } from 'lucide-react';

const faqs = [
  { q: 'How do I start the camera?', a: 'Go to Live Camera page, click "Start Camera", and grant permission when prompted. Works best in Chrome or Edge.' },
  { q: 'Why is the AI not responding?', a: 'Ensure the backend server is running: cd backend && uvicorn main:app --reload. Check http://localhost:8000/health.' },
  { q: 'How does voice input work?', a: 'Tap the microphone button and speak clearly. Uses the browser\'s built-in Web Speech API. Works in Chrome.' },
  { q: 'Can I use this offline?', a: 'The app shell loads offline. AI analysis requires the backend server running locally. No internet needed in demo mode.' },
  { q: 'How do I enable text-to-speech?', a: 'Click the speaker icon next to any result to hear it. Adjust speed in Accessibility settings.' },
  { q: 'What is Demo Mode?', a: 'Demo mode uses pre-configured realistic AI responses without needing an API key. Perfect for capstone presentations.' },
  { q: 'How do I deploy with Docker?', a: 'Run: docker-compose up --build from the project root. Frontend: port 3000, Backend: 8000, MCP: 8001.' },
];

const quickLinks = [
  { icon: Camera,       label: 'Live Camera',      desc: 'Start AI camera analysis', link: '/camera' },
  { icon: MessageSquare, label: 'AI Assistant',    desc: 'Chat with the AI',          link: '/assistant' },
  { icon: Mic,          label: 'Voice Commands',   desc: 'Speak your commands',        link: '/camera' },
  { icon: Server,       label: 'API Docs',         desc: 'http://localhost:8000/docs', link: 'http://localhost:8000/docs' },
];

export function Help() {
  return (
    <div>
      <Header title="Help & Documentation" subtitle="Get started and troubleshoot" />
      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* Quick links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ icon: Icon, label, desc, link }) => (
            <a key={label} href={link}
              className="card hover:border-primary-500/50 transition-colors flex flex-col gap-2 no-underline">
              <Icon size={20} className="text-primary-400" />
              <p className="font-semibold text-white text-sm">{label}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </a>
          ))}
        </div>

        {/* Commands reference */}
        <div className="card">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
            <Mic size={16} className="text-primary-400" /> Voice Command Reference
          </h3>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            {[
              ['"Describe the scene"', 'Full scene description'],
              ['"Detect objects"', 'List all visible objects'],
              ['"Read the text"', 'Extract text from image'],
              ['"Recognize currency"', 'Identify money denomination'],
              ['"Analyze clothing"', 'Clothing color and style'],
              ['"Navigate me safely"', 'Obstacle detection and guidance'],
              ['"What do you see?"', 'General scene overview'],
              ['"Find obstacles"', 'Navigation safety scan'],
            ].map(([cmd, desc]) => (
              <div key={cmd} className="flex justify-between items-center py-2 border-b border-surface-700 last:border-0">
                <code className="text-primary-400">{cmd}</code>
                <span className="text-slate-400">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="card">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
            <HelpCircle size={16} className="text-primary-400" /> Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-b border-surface-700 pb-4 last:border-0 last:pb-0">
                <p className="font-medium text-white text-sm mb-1">{q}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div className="card">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
            <Book size={16} className="text-primary-400" /> Architecture
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            {[
              { title: 'Frontend', items: ['React 18 + TypeScript', 'Vite + Tailwind CSS', 'React Router v6', 'Zustand state', 'Web Speech API', 'WebRTC Camera'] },
              { title: 'Backend', items: ['FastAPI (Python)', 'SQLAlchemy + SQLite', 'Multi-Agent System', '9 Specialized Agents', 'Planner orchestration', 'REST API + CORS'] },
              { title: 'MCP Server', items: ['Pillow image tools', 'Preprocess images', 'OCR enhancement', 'Color extraction', 'Edge detection', 'Memory query'] },
            ].map(({ title, items }) => (
              <div key={title}>
                <p className="font-semibold text-primary-400 mb-2">{title}</p>
                <ul className="space-y-1">
                  {items.map(i => <li key={i} className="text-slate-400 flex items-center gap-1"><span className="text-primary-500">•</span>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

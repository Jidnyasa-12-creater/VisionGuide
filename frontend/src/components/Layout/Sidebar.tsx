import { NavLink } from 'react-router-dom';
import {
  Eye, Camera, MessageSquare, Search, Scan, FileText,
  Coins, Shirt, Navigation, History, Brain, Accessibility,
  Settings, HelpCircle, X, Sparkles
} from 'lucide-react';
import { useAppStore } from '../../store';

const links = [
  { to: '/',                  icon: Eye,           label: 'Dashboard' },
  { to: '/camera',            icon: Camera,        label: 'Live Camera' },
  { to: '/assistant',         icon: MessageSquare, label: 'AI Assistant' },
  { to: '/scene',             icon: Search,        label: 'Scene Description' },
  { to: '/objects',           icon: Scan,          label: 'Object Detection' },
  { to: '/ocr',               icon: FileText,      label: 'Read Text (OCR)' },
  { to: '/currency',          icon: Coins,         label: 'Currency' },
  { to: '/clothing',          icon: Shirt,         label: 'Clothing Analysis' },
  { to: '/navigation',        icon: Navigation,    label: 'Navigation' },
  { to: '/history',           icon: History,       label: 'History' },
  { to: '/memory',            icon: Brain,         label: 'Memory' },
  { to: '/accessibility',     icon: Accessibility, label: 'Accessibility' },
  { to: '/settings',          icon: Settings,      label: 'Settings' },
  { to: '/help',              icon: HelpCircle,    label: 'Help' },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-surface-800 border-r border-surface-700 shadow-2xl
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-surface-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">VisionGuide</p>
              <p className="text-xs text-slate-400">AI</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-surface-700">
          <div className="text-xs text-slate-500 text-center">
            VisionGuide AI v1.0.0<br />
            <span className="text-green-400">● Demo Mode</span>
          </div>
        </div>
      </aside>
    </>
  );
}

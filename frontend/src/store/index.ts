import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Theme & Accessibility
  highContrast: boolean;
  largeText: boolean;
  theme: 'dark' | 'light';
  speechRate: number;

  // Session
  sessionId: string;
  userId: string;

  // UI state
  sidebarOpen: boolean;
  lastResult: string;
  isLoading: boolean;

  // Actions
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  setTheme: (t: 'dark' | 'light') => void;
  setSpeechRate: (r: number) => void;
  setSidebarOpen: (open: boolean) => void;
  setLastResult: (r: string) => void;
  setLoading: (l: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      highContrast: false,
      largeText: false,
      theme: 'dark',
      speechRate: 1.0,
      sessionId: 'default',
      userId: 'default',
      sidebarOpen: true,
      lastResult: '',
      isLoading: false,

      toggleHighContrast: () => {
        const next = !get().highContrast;
        set({ highContrast: next });
        document.body.classList.toggle('high-contrast', next);
      },
      toggleLargeText: () => {
        const next = !get().largeText;
        set({ largeText: next });
        document.body.classList.toggle('large-text', next);
      },
      setTheme: (t) => set({ theme: t }),
      setSpeechRate: (r) => set({ speechRate: r }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setLastResult: (r) => set({ lastResult: r }),
      setLoading: (l) => set({ isLoading: l }),
    }),
    { name: 'visionguide-settings' }
  )
);

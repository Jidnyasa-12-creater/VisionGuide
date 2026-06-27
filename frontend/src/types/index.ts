// Shared TypeScript types for VisionGuide AI

export interface AnalysisResult {
  result: string;
  analysis_type: string;
  session_id: string;
}

export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface Memory {
  id: number;
  key: string;
  value: string;
  category: string;
}

export interface UserSettings {
  high_contrast: number;
  large_text: number;
  speech_rate: number;
  language: string;
  theme: string;
}

export interface HistoryRecord {
  id: number;
  type: string;
  result: string;
  timestamp: string;
}

export type AnalysisType =
  | 'scene'
  | 'objects'
  | 'ocr'
  | 'currency'
  | 'clothing'
  | 'navigation'
  | 'gestures';

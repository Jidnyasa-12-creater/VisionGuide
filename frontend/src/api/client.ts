import axios from 'axios';
import type { AnalysisResult, ChatMessage, Memory, UserSettings, HistoryRecord } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

// ── Analysis ──────────────────────────────────────────────────────────
export async function analyzeImage(
  file: Blob,
  type: string,
  sessionId = 'default'
): Promise<AnalysisResult> {
  const form = new FormData();
  form.append('file', file, 'capture.jpg');
  const { data } = await api.post(`/analyze/${type}?session_id=${sessionId}`, form);
  return data;
}

// ── Chat ──────────────────────────────────────────────────────────────
export async function sendChat(
  message: string,
  sessionId = 'default'
): Promise<{ response: string; session_id: string }> {
  const { data } = await api.post('/chat', { message, session_id: sessionId });
  return data;
}

export async function getChatHistory(
  sessionId = 'default'
): Promise<{ messages: ChatMessage[] }> {
  const { data } = await api.get(`/chat/history/${sessionId}`);
  return data;
}

export async function clearChatHistory(sessionId = 'default') {
  const { data } = await api.delete(`/chat/history/${sessionId}`);
  return data;
}

// ── Voice Command ─────────────────────────────────────────────────────
export async function sendVoiceCommand(
  command: string,
  sessionId = 'default'
): Promise<{ response: string; agent: string }> {
  const { data } = await api.post('/voice/command', { command, session_id: sessionId });
  return data;
}

// ── Memory ────────────────────────────────────────────────────────────
export async function getMemory(userId = 'default'): Promise<{ memories: Memory[] }> {
  const { data } = await api.get(`/memory/${userId}`);
  return data;
}

export async function saveMemory(
  key: string,
  value: string,
  category = 'general',
  userId = 'default'
) {
  const { data } = await api.post(`/memory/${userId}`, { key, value, category });
  return data;
}

export async function deleteMemory(key: string, userId = 'default') {
  const { data } = await api.delete(`/memory/${userId}/${key}`);
  return data;
}

// ── Settings ──────────────────────────────────────────────────────────
export async function getSettings(userId = 'default'): Promise<UserSettings> {
  const { data } = await api.get(`/settings/${userId}`);
  return data;
}

export async function updateSettings(
  settings: Partial<UserSettings>,
  userId = 'default'
) {
  const { data } = await api.put(`/settings/${userId}`, settings);
  return data;
}

// ── History ───────────────────────────────────────────────────────────
export async function getHistory(
  sessionId = 'default'
): Promise<{ records: HistoryRecord[] }> {
  const { data } = await api.get(`/history/${sessionId}`);
  return data;
}

// ── Health ────────────────────────────────────────────────────────────
export async function checkHealth(): Promise<{ status: string }> {
  const { data } = await api.get('/health');
  return data;
}

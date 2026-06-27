import { useState, useRef, useEffect } from 'react';
import { Header } from '../components/Layout/Header';
import { VoiceButton } from '../components/Voice/VoiceButton';
import { sendChat } from '../api/client';
import { useSpeech } from '../hooks/useSpeech';
import { Eye, Type, Volume2, Contrast } from 'lucide-react';
import type { ChatMessage } from '../types';

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm VisionGuide AI. I can help you describe scenes, detect objects, read text, identify currency, analyze clothing, and guide your navigation. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { speak } = useSpeech();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const data = await sendChat(text);
      const aiMsg: ChatMessage = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, aiMsg]);
      speak(data.response);
    } catch {
      const errMsg: ChatMessage = { role: 'assistant', content: 'Sorry, I could not connect to the AI backend. Please make sure the server is running.' };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="AI Assistant" subtitle="Chat with your voice-first AI companion" />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 animate-fade-in ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'assistant' ? 'bg-primary-600' : 'bg-accent-500'}`}>
              {m.role === 'assistant' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              m.role === 'assistant'
                ? 'bg-surface-700 text-white rounded-tl-sm'
                : 'bg-primary-600 text-white rounded-tr-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-surface-700 px-4 py-3 rounded-2xl rounded-tl-sm">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-surface-700 p-4 bg-surface-800">
        <div className="max-w-3xl mx-auto flex gap-3">
          <VoiceButton onResult={sendMessage} size="sm" />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Type or speak your question…"
            className="flex-1 bg-surface-700 border border-surface-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="btn-primary px-4 py-2.5"
            aria-label="Send"
          >
            <Send size={18} />
          </button>
          <button
            onClick={() => setMessages([messages[0]])}
            className="btn-ghost px-3"
            aria-label="Clear chat"
            title="Clear chat"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

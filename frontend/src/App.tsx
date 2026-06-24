import React, { useState } from 'react';
import axios from 'axios';
import { Camera, Mic, Volume2, Settings, Eye, Text, Search, Coins, Sparkles } from 'lucide-react';

function App() {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle('high-contrast');
  };

  const toggleLargeText = () => {
    setLargeText(!largeText);
    document.body.classList.toggle('large-text');
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAction = async (action: string) => {
    setLoading(true);
    setResponse('');
    try {
      // Mocked file for endpoints
      const blob = new Blob(["mock"], { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("file", blob, "test.jpg");

      let res;
      if (action === 'scene') res = await axios.post('http://localhost:8000/analyze-scene', formData);
      else if (action === 'objects') res = await axios.post('http://localhost:8000/detect-objects', formData);
      else if (action === 'text') res = await axios.post('http://localhost:8000/read-text', formData);
      else if (action === 'currency') res = await axios.post('http://localhost:8000/recognize-currency', formData);

      const msg = res?.data.scene || res?.data.objects?.join(', ') || res?.data.text || res?.data.currency;
      setResponse(msg);
      speak(msg);
    } catch (e) {
      setResponse("Error connecting to server. Please ensure the backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 flex flex-col ${highContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900'}`}>
      
      {/* Glassmorphic Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-lg border-b p-6 flex justify-between items-center shadow-sm transition-all duration-300 ${highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white/70 border-white/20'}`}>
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg text-white">
            <Eye size={28} />
            <Sparkles size={14} className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
            VisionGuide AI
          </h1>
        </div>
        <div className="flex gap-3">
          <button onClick={toggleHighContrast} className={`p-3 rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 font-semibold ${highContrast ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-gray-900 text-white hover:bg-gray-800 hover:-translate-y-1'}`} aria-label="Toggle High Contrast">
            <Settings size={22} />
            <span className="hidden sm:inline">Contrast</span>
          </button>
          <button onClick={toggleLargeText} className={`p-3 rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 font-bold ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:-translate-y-1'}`} aria-label="Toggle Large Text">
            <span className="text-xl">Aa</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
        
        {/* Left Column: Camera Feed */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className={`relative overflow-hidden shadow-2xl rounded-3xl p-8 border border-white/50 transition-all duration-500 flex flex-col items-center justify-center aspect-square ${highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white/60 backdrop-blur-xl'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/10 pointer-events-none"></div>
            
            <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-6 group cursor-pointer hover:scale-105 transition-transform">
              <div className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-50 animate-ping"></div>
              <Camera size={48} className="text-blue-600 dark:text-blue-400 z-10" />
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-2">Live Camera Feed</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center font-medium max-w-[250px]">
              Point your device at your surroundings to begin AI analysis.
            </p>
          </div>

          {/* Response Box */}
          <div className={`p-6 rounded-3xl shadow-xl border transition-all duration-500 flex items-start gap-5 min-h-[120px] ${highContrast ? 'bg-gray-900 border-gray-700' : 'bg-gradient-to-r from-blue-600 to-indigo-700 border-transparent text-white'}`}>
            <Volume2 size={36} className={`flex-shrink-0 mt-1 ${highContrast ? 'text-yellow-400' : 'text-blue-200'}`} />
            <div className="flex-1">
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${highContrast ? 'text-gray-400' : 'text-blue-200'}`}>AI Assistant Response</h3>
              <p className={`text-xl font-medium leading-relaxed ${loading ? 'animate-pulse' : ''}`}>
                {loading ? "Analyzing your surroundings..." : (response || "Awaiting your command. Tap an action to start.")}
              </p>
            </div>
          </div>
        </section>

        {/* Right Column: Actions */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <button onClick={() => handleAction('scene')} className={`group relative overflow-hidden p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center gap-4 ${highContrast ? 'bg-gray-800 border-2 border-white text-white hover:bg-gray-700' : 'bg-white border border-gray-100 text-gray-800'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-4 rounded-2xl bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                <Search size={40} />
              </div>
              <span className="font-extrabold text-2xl">Describe Scene</span>
              <p className="text-center text-sm opacity-70">Get a complete overview of what's in front of you.</p>
            </button>
            
            <button onClick={() => handleAction('objects')} className={`group relative overflow-hidden p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center gap-4 ${highContrast ? 'bg-gray-800 border-2 border-white text-white hover:bg-gray-700' : 'bg-white border border-gray-100 text-gray-800'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-4 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Eye size={40} />
              </div>
              <span className="font-extrabold text-2xl">Detect Objects</span>
              <p className="text-center text-sm opacity-70">Identify specific items like laptops, mugs, or chairs.</p>
            </button>

            <button onClick={() => handleAction('text')} className={`group relative overflow-hidden p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center gap-4 ${highContrast ? 'bg-gray-800 border-2 border-white text-white hover:bg-gray-700' : 'bg-white border border-gray-100 text-gray-800'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-4 rounded-2xl bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform">
                <Text size={40} />
              </div>
              <span className="font-extrabold text-2xl">Read Text</span>
              <p className="text-center text-sm opacity-70">Extract and read aloud text from signs or documents.</p>
            </button>

            <button onClick={() => handleAction('currency')} className={`group relative overflow-hidden p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center gap-4 ${highContrast ? 'bg-gray-800 border-2 border-white text-white hover:bg-gray-700' : 'bg-white border border-gray-100 text-gray-800'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-4 rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                <Coins size={40} />
              </div>
              <span className="font-extrabold text-2xl">Recognize Money</span>
              <p className="text-center text-sm opacity-70">Identify the denomination of bills and coins.</p>
            </button>
          </div>
        </section>
      </main>

      {/* Sticky Voice Command Footer */}
      <footer className="sticky bottom-6 mt-auto w-full max-w-lg mx-auto px-6">
        <button className="group relative w-full overflow-hidden rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-1">
          <div className={`absolute inset-0 transition-opacity duration-300 ${highContrast ? 'bg-white' : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600'}`}></div>
          <div className="relative px-8 py-5 flex items-center justify-center gap-4">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-black text-white' : 'bg-white/20 text-white'}`}>
              <Mic size={32} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className={`text-2xl font-extrabold tracking-wide ${highContrast ? 'text-black' : 'text-white'}`}>
              Hold to Speak
            </span>
          </div>
        </button>
      </footer>
    </div>
  );
}

export default App;

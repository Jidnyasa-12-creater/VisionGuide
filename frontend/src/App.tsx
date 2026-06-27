import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { LiveCamera } from './pages/LiveCamera';
import { AIAssistant } from './pages/AIAssistant';
import { SceneDescription } from './pages/SceneDescription';
import { ObjectDetection } from './pages/ObjectDetection';
import { OCR } from './pages/OCR';
import { CurrencyRecognition } from './pages/CurrencyRecognition';
import { ClothingRecognition } from './pages/ClothingRecognition';
import { NavigationAssistant } from './pages/NavigationAssistant';
import { ConversationHistory } from './pages/ConversationHistory';
import { MemoryPage } from './pages/Memory';
import { AccessibilityPage } from './pages/Accessibility';
import { SettingsPage } from './pages/Settings';
import { Help } from './pages/Help';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="camera" element={<LiveCamera />} />
          <Route path="assistant" element={<AIAssistant />} />
          <Route path="scene" element={<SceneDescription />} />
          <Route path="objects" element={<ObjectDetection />} />
          <Route path="ocr" element={<OCR />} />
          <Route path="currency" element={<CurrencyRecognition />} />
          <Route path="clothing" element={<ClothingRecognition />} />
          <Route path="navigation" element={<NavigationAssistant />} />
          <Route path="history" element={<ConversationHistory />} />
          <Route path="memory" element={<MemoryPage />} />
          <Route path="accessibility" element={<AccessibilityPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

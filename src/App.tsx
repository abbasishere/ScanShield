import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { InputBar } from './components/InputBar';
import { EngineInfoModal } from './components/EngineInfoModal';
import { ChatMessage, ScamSample, ScamAnalysisResult } from './types/scam';
import { analyzeCustomInputAsync, checkBackendHealth, HACKATHON_SAMPLES } from './services/evidenceEngine';

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [engineInfoOpen, setEngineInfoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState<string | undefined>(undefined);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string; riskLevel?: string }[]>([]);

  // Check live backend engine status on load
  useEffect(() => {
    let isMounted = true;
    const verifyHealth = async () => {
      const healthy = await checkBackendHealth();
      if (isMounted) setIsBackendConnected(healthy);
    };

    verifyHealth();
    const interval = setInterval(verifyHealth, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Toggle sidebar
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Start new empty analysis
  const handleNewAnalysis = () => {
    setMessages([]);
    setActiveSampleId(undefined);
  };

  // Select pre-loaded Hackathon sample scenario
  const handleSelectSample = (sample: ScamSample) => {
    setActiveSampleId(sample.id);
    setIsLoading(true);

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: sample.userMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: sample.imageUrl,
      pastedUrl: sample.pastedUrl
    };

    setMessages([userMsg]);

    // Simulate AI pipeline verification stream
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: sample.sampleResult.simpleExplanation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        analysisResult: sample.sampleResult,
        pastedUrl: sample.pastedUrl,
        imageUrl: sample.imageUrl
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);

      // Add to history
      setChatHistory((prev) => [
        { id: sample.id, title: sample.title, riskLevel: sample.sampleResult.riskLevel },
        ...prev.filter((h) => h.id !== sample.id)
      ]);
    }, 800);
  };

  // Send custom user prompt (text, image, or pasted URL)
  const handleSendMessage = async (text: string, imageUrl?: string, pastedUrl?: string) => {
    setIsLoading(true);
    setActiveSampleId(undefined);

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text || (imageUrl ? 'Uploaded screenshot for OCR verification.' : 'Pasted link for scan.'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl,
      pastedUrl
    };

    setMessages((prev) => [...prev, userMsg]);

    // Fetch live backend analysis from Python FastAPI server (with fallback)
    const result: ScamAnalysisResult = await analyzeCustomInputAsync(
      text,
      pastedUrl,
      imageUrl,
      imageUrl ? 'Screenshot_Scan.png' : undefined
    );

    // Re-verify backend status in case state changed
    checkBackendHealth().then(setIsBackendConnected);

    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: result.simpleExplanation,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      analysisResult: result,
      pastedUrl,
      imageUrl
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsLoading(false);

    // Add to history list
    const titleSnippet = text.length > 28 ? `${text.substring(0, 28)}...` : text || (pastedUrl ? 'URL Scan' : 'Screenshot Scan');
    setChatHistory((prev) => [
      { id: userMsgId, title: titleSnippet, riskLevel: result.riskLevel },
      ...prev
    ]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* ChatGPT Style Collapsible Left Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
        onSelectSample={handleSelectSample}
        onNewAnalysis={handleNewAnalysis}
        activeSampleId={activeSampleId}
        chatHistoryTitles={chatHistory}
        onSelectHistoryItem={() => {}}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onOpenEngineInfo={() => setEngineInfoOpen(true)}
          onClearChat={handleNewAnalysis}
          isBackendConnected={isBackendConnected}
        />

        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onSelectSample={handleSelectSample}
        />

        <InputBar
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onSelectQuickPrompt={(prompt) => handleSendMessage(prompt)}
        />
      </div>

      {/* Engine Formula Modal */}
      <EngineInfoModal
        isOpen={engineInfoOpen}
        onClose={() => setEngineInfoOpen(false)}
      />
    </div>
  );
}

export default App;


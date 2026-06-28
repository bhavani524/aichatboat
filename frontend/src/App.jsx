import React, { useState, useRef, useEffect, useCallback } from 'react';
import BubbleBackground from './components/BubbleBackground.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import Sidebar from './components/Sidebar.jsx';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import ChatMessage from './components/ChatMessage.jsx';
import ChatInput from './components/ChatInput.jsx';
import VideoGenerator from './components/VideoGenerator.jsx';
import { chatAgent } from './utils/chatAgent.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('chat'); // 'chat' | 'video'
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const endRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const handleSend = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return;

      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: text, type: 'text' }]);
      setIsLoading(true);

      try {
        const result = await chatAgent({ message: text, conversationId, signal });

        setConversationId(result.conversationId);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'ai',
            type: result.type,
            content: result.reply || text,
            mediaUrl: result.mediaUrl,
          },
        ]);
      } catch (error) {
        if (error.name === 'AbortError') return;
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: 'ai', type: 'text', content: `⚠️ ${error.message}` },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, isLoading],
  );

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-zinc-950 text-zinc-100 relative">
      <BubbleBackground />
      {!user && <AuthScreen onLogin={setUser} />}

      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen((s) => !s)}
        onNewChat={handleNewChat}
        view={view}
        setView={setView}
        onLogout={() => {
          localStorage.removeItem('authToken');
          setUser(null);
          handleNewChat();
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="md:hidden flex items-center justify-between p-3 border-b border-zinc-800">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-zinc-400">☰</button>
          <span className="font-medium">AI Assistant</span>
          <div className="w-8" />
        </div>

        {view === 'video' ? (
          <div className="flex-1 overflow-y-auto">
            <VideoGenerator />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto flex flex-col items-center">
              {messages.length === 0 ? (
                <WelcomeScreen onSuggestionClick={(t) => handleSend(t)} />
              ) : (
                <div className="w-full max-w-3xl px-4 py-8 flex flex-col gap-6 pb-32">
                  {messages.map((m) => (
                    <ChatMessage key={m.id} message={m} />
                  ))}
                  {isLoading && (
                    <div className="flex gap-2 text-zinc-400 px-2">
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce [animation-delay:150ms]">●</span>
                      <span className="animate-bounce [animation-delay:300ms]">●</span>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>
              )}
            </div>

            <div className="absolute bottom-0 w-full bg-gradient-to-t from-zinc-950 to-transparent pt-6 pb-4 px-4 flex justify-center">
              <div className="w-full max-w-3xl">
                <ChatInput onSend={handleSend} isLoading={isLoading} />
                <div className="text-center mt-2 text-xs text-zinc-500">
                  AI can make mistakes. Verify important info.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
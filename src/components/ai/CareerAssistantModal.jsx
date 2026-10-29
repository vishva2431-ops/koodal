import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Globe, 
  MapPin, 
  ExternalLink, 
  X, 
  Trash2, 
  HelpCircle,
  Compass,
  Building,
  RefreshCw
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard.jsx';
import { GlassButton } from '../ui/GlassButton.jsx';
import { ApiService } from '../../services/api.js';
import { useApp } from '../../context/AppContext.jsx';

export const CareerAssistantModal = ({ isOpen, onClose }) => {
  const { profile } = useApp();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Vanakkam! I am your Koodal AI Career Assistant powered by Gemini. I can help with React & Frontend interview prep, resume tailoring, Tamil Nadu salary benchmarks, and tech hub commute routes (Chennai OMR, Coimbatore TIDEL, Madurai ELCOT). How can I assist your career journey today?",
      sources: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [toolMode, setToolMode] = useState('none'); // 'none' | 'search' | 'maps'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Chennai OMR Tech Commute', mode: 'maps', prompt: 'Guide me on commuting to Taramani and OMR tech parks in Chennai for a React Developer.' },
    { label: 'Coimbatore TIDEL Park Access', mode: 'maps', prompt: 'Tell me about Coimbatore TIDEL Park tech companies and transit connectivity.' },
    { label: 'TN React Salary Benchmarks', mode: 'search', prompt: 'What are current 2026 salary trends for React and Frontend developers in Tamil Nadu?' },
    { label: 'React Senior Interview Prep', mode: 'none', prompt: 'Give me 3 critical React architecture questions asked in Chennai tech companies.' },
  ];

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMessage = { role: 'user', content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue('');
    setLoading(true);

    try {
      // Gather optional user location if available
      let userLocation = { latitude: 13.0827, longitude: 80.2707 }; // Default Chennai
      if (toolMode === 'maps' && navigator.geolocation) {
        try {
          const pos = await new Promise((res, rej) => 
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 4000 })
          );
          userLocation = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };
        } catch {
          // fallback to Tamil Nadu default
        }
      }

      const res = await ApiService.chatWithGemini({
        messages: nextMessages,
        prompt: text,
        toolMode,
        userLocation,
        candidateContext: {
          fullName: profile.fullName,
          preferredRoles: profile.preferredRoles,
          preferredLocations: profile.preferredLocations,
          skills: profile.skills,
          experienceYears: profile.experienceYears,
        }
      });

      const replyContent = res.reply || "I couldn't process that response. Please try again.";
      const assistantMessage = {
        role: 'assistant',
        content: replyContent,
        sources: res.sources || [],
        isNotice: res.isNotice || false,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'An error occurred while contacting the AI assistant. Please try again.',
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Conversation history cleared. Feel free to ask about tech corridors in Tamil Nadu, interview questions, or real-time hiring trends!",
        sources: []
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="relative w-full max-w-3xl h-[85vh] flex flex-col rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-xs shadow-indigo-500/25">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Koodal Career Assistant
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20 font-semibold">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Grounded tech mentoring for Tamil Nadu developers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              title="Clear Conversation"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close Assistant"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grounding Mode Selector */}
        <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Grounding Tools:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setToolMode('none')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                toolMode === 'none'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Standard AI
            </button>
            <button
              onClick={() => setToolMode('search')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                toolMode === 'search'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Ground answers with live Google Search for current tech hiring news"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Google Search</span>
            </button>
            <button
              onClick={() => setToolMode('maps')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                toolMode === 'maps'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Ground answers with Google Maps for tech parks, commute routes & locations"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Grounded Sources */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-white/10 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
                      Grounded Sources ({m.sources.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {src.type === 'map' ? (
                            <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                          ) : (
                            <Globe className="w-3 h-3 text-emerald-500 shrink-0" />
                          )}
                          <span className="truncate max-w-[200px]">{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic py-2">
              <span className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing career query with {toolMode === 'maps' ? 'Google Maps Grounding' : toolMode === 'search' ? 'Google Search Grounding' : 'Gemini'}...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-200/80 dark:border-white/5 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Quick Ask:</span>
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setToolMode(chip.mode);
                handleSend(chip.prompt);
              }}
              className="text-[11px] whitespace-nowrap px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-white transition-all shrink-0 cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                toolMode === 'maps'
                  ? "Ask about Tamil Nadu tech hubs, transit, or tech park locations..."
                  : toolMode === 'search'
                  ? "Search live hiring news, tech stack requirements, or salary benchmarks..."
                  : "Ask anything about React careers, interview preparation, or portfolio advice..."
              }
              className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <GlassButton
              type="submit"
              variant="primary"
              disabled={!inputValue.trim() || loading}
              icon={Send}
              loading={loading}
            >
              Send
            </GlassButton>
          </form>
        </div>

      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Cpu, Maximize2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  model?: string;
}

export const RightAIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Greetings Developer! I am the CodeVerse AI Assistant. Ask me to trace dependencies, analyze 3D graph relationships, or generate code refactors across your monorepo.',
      timestamp: '11:15 AM',
      model: 'Model Router (Gemini / DeepSeek)',
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulated AI response
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Analyzing graph for query: "${userMsg.text}". The RAG engine has indexed 12 module planets and 313 symbol nodes across packages/universe-sdk and apps/web.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'Model Router',
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  return (
    <aside className="w-80 h-[calc(100vh-3.5rem)] glass-panel border-l border-slate-800/80 flex flex-col z-20 select-none">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center p-0.5 shadow-glow-indigo">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          </div>
          <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
            AI Assistant
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono">
            <Cpu className="w-3 h-3" />
            <span>Auto-Router</span>
          </div>
          <button
            type="button"
            aria-label="Expand AI Assistant Panel"
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-1 text-[10px] text-slate-500 mb-1 px-1">
              {msg.sender === 'ai' ? (
                <>
                  <Bot className="w-3 h-3 text-cyan-400" />
                  <span className="font-semibold text-cyan-400">CodeVerse AI</span>
                  {msg.model && <span className="text-[9px] text-slate-600">({msg.model})</span>}
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-indigo-400" />
                  <span className="font-semibold text-indigo-400">You</span>
                </>
              )}
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-2.5 rounded-xl max-w-[90%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-glow-indigo'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-1.5 border-t border-slate-800/40 bg-slate-950/40 flex items-center space-x-1.5 overflow-x-auto text-[10px]">
        <button
          type="button"
          onClick={() => setInput('Explain graph engine dependencies')}
          className="whitespace-nowrap px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 cursor-pointer transition-all"
        >
          ⚡ Explain Dependencies
        </button>
        <button
          type="button"
          onClick={() => setInput('Find memory leaks in render loop')}
          className="whitespace-nowrap px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 cursor-pointer transition-all"
        >
          🔍 Audit Performance
        </button>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-slate-800/80 bg-slate-950/80 flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI assistant about repository..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        <button
          type="submit"
          aria-label="Send message to AI Assistant"
          className="p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-slate-950 font-bold transition-all shadow-glow-cyan cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </aside>
  );
};

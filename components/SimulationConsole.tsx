import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { Activity, Radio, Cpu } from 'lucide-react';

interface SimulationConsoleProps {
  messages: Message[];
  status: 'idle' | 'running' | 'completed' | 'error';
}

const SimulationConsole: React.FC<SimulationConsoleProps> = ({ messages, status }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  return (
    <div className="relative flex flex-col h-[55vh] w-full max-w-4xl mx-auto mt-8">
      
      {/* HUD Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/20 backdrop-blur-sm rounded-t-lg">
        <div className="flex items-center gap-3">
          <Activity size={14} className="text-gray-400" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-gray-400 uppercase">Live Transcript // V.7.2</span>
        </div>
        <div className="flex items-center gap-2">
           {status === 'running' && <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_red]" />}
           <span className="text-[10px] font-mono text-gray-500">{status.toUpperCase()}</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)' }}
      >
         {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
               <Radio size={48} />
               <p className="font-serif-display tracking-widest text-sm">SYSTEM DORMANT</p>
            </div>
         )}

         {messages.map((msg) => (
           <div 
             key={msg.id}
             className={`group relative pl-6 border-l-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${
               msg.role === 'researcher' ? 'border-cyan-500/50' : 
               msg.role === 'reviewer' ? 'border-pink-500/50' : 
               'border-gray-700'
             }`}
           >
             {/* Glowing Dot on Border */}
             <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${
                msg.role === 'researcher' ? 'bg-cyan-500 shadow-[0_0_10px_cyan]' :
                msg.role === 'reviewer' ? 'bg-pink-500 shadow-[0_0_10px_magenta]' :
                'bg-gray-500'
             }`} />

             {/* Header */}
             <div className="flex items-center gap-3 mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-mono uppercase tracking-wider">{msg.role}</span>
               <span className="text-[10px] font-mono text-gray-600">{new Date(msg.timestamp).toLocaleTimeString()}</span>
             </div>

             {/* Content */}
             <div className="prose prose-invert max-w-none prose-p:text-sm prose-p:leading-relaxed prose-headings:font-serif-display prose-headings:tracking-wide text-gray-300/90 font-light">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
             </div>
           </div>
         ))}
      </div>

      {/* Footer Decoration */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
};

export default SimulationConsole;
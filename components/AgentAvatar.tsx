import React from 'react';
import { AgentConfig } from '../types';
import { Sparkles, BrainCircuit } from 'lucide-react';

interface AgentAvatarProps {
  agent: AgentConfig;
  isActive: boolean;
  isThinking?: boolean;
}

const AgentAvatar: React.FC<AgentAvatarProps> = ({ agent, isActive, isThinking }) => {
  // Cinematic Orb Design
  return (
    <div className={`relative flex flex-col items-center justify-center transition-all duration-700 ${isActive ? 'scale-110 opacity-100' : 'opacity-40 scale-90 blur-[1px]'}`}>
      
      {/* Orb Container */}
      <div className="relative mb-6 group cursor-default">
        {/* Outer Glow Ring */}
        <div 
          className="absolute inset-[-8px] rounded-full border border-transparent transition-all duration-1000"
          style={{ 
            borderColor: isActive ? agent.color : 'transparent',
            boxShadow: isActive ? `0 0 30px ${agent.color}40` : 'none',
            transform: isThinking ? 'scale(1.2)' : 'scale(1)'
          }}
        />
        
        {/* Rotating Dashed Ring (Tech feel) */}
        {isActive && (
           <div className="absolute inset-[-16px] rounded-full border border-dashed border-white/20 w-[calc(100%+32px)] h-[calc(100%+32px)] animate-[spin_10s_linear_infinite]" />
        )}

        {/* The Core Orb */}
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden backdrop-blur-md bg-white/5 border border-white/10"
          style={{ 
            boxShadow: `inset 0 0 20px ${agent.color}20` 
          }}
        >
          {/* Inner Light */}
          <div 
            className={`absolute w-full h-full opacity-50 bg-gradient-to-tr from-transparent via-${agent.color} to-transparent transition-all duration-300`}
            style={{ background: `radial-gradient(circle at 30% 30%, ${agent.color}, transparent 70%)` }}
          />
          
          {agent.role === 'researcher' ? <Sparkles size={20} className="text-white relative z-10" /> : <BrainCircuit size={20} className="text-white relative z-10" />}
        </div>

        {/* Status Dot */}
        {isThinking && (
          <div className="absolute -top-2 -right-2 flex gap-1">
             <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce delay-0" />
             <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce delay-100" />
             <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce delay-200" />
          </div>
        )}
      </div>

      {/* Label Info */}
      <div className="text-center space-y-1">
        <div className="flex items-center gap-2 justify-center">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500">{agent.role}</span>
        </div>
        <h3 className="font-serif-display text-xl text-white tracking-wider text-glow">{agent.name}</h3>
        {isActive && (
           <p className="text-[10px] font-mono text-gray-400 max-w-[150px] mx-auto animate-in fade-in slide-in-from-top-2">
             {isThinking ? "PROCESSING DATA STREAM..." : "AWAITING INPUT"}
           </p>
        )}
      </div>
    </div>
  );
};

export default AgentAvatar;
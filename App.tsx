import React, { useState, useCallback, useRef } from 'react';
import { SimulationState, Message, AgentConfig } from './types';
import { generateResearcherResponse, generateReviewerResponse } from './services/geminiService';
import SimulationConsole from './components/SimulationConsole';
import AgentAvatar from './components/AgentAvatar';
import BackgroundGrid from './components/BackgroundGrid';
import TypewriterTitle from './components/TypewriterTitle';
import { ArrowRight, Disc, Play, RefreshCcw } from 'lucide-react';

const RESEARCHER: AgentConfig = {
  name: "Unit-734",
  role: 'researcher',
  color: '#00f0ff',
  description: "DRAFTER",
  systemPrompt: ""
};

const REVIEWER: AgentConfig = {
  name: "Critic-X1",
  role: 'reviewer',
  color: '#ff00aa',
  description: "AUDITOR",
  systemPrompt: ""
};

const SUGGESTIONS = [
  "Space Tourism Logistics",
  "Vertical Farming 2050",
  "AI Ethics Constitution",
  "Ocean City Blueprint"
];

const MAX_TURNS = 4;
const HERO_LINES = ["AGENTS THAT", "THINK TOGETHER"];

export default function App() {
  const [topicInput, setTopicInput] = useState('');
  const [activeAgent, setActiveAgent] = useState<'researcher' | 'reviewer' | null>(null);
  const [state, setState] = useState<SimulationState>({
    topic: '',
    status: 'idle',
    turnCount: 0,
    maxTurns: MAX_TURNS,
    messages: []
  });

  const generateId = () => Math.random().toString(36).substring(7);

  const startSimulation = useCallback(async (customTopic?: string) => {
    const topic = customTopic || topicInput;
    if (!topic.trim()) return;

    setState({
      topic,
      status: 'running',
      turnCount: 0,
      maxTurns: MAX_TURNS,
      messages: [{
        id: generateId(),
        role: 'system',
        content: `**SYSTEM INITIATED**\nDirective Received: "${topic}".\n\nInitializing bounded collaboration sequence...`,
        timestamp: Date.now()
      }]
    });

    processTurn('researcher', topic, []);
  }, [topicInput]);

  const processTurn = async (role: 'researcher' | 'reviewer', topic: string, history: Message[]) => {
    setActiveAgent(role);

    await new Promise(resolve => setTimeout(resolve, 2000)); // Cinematic delay

    let response = '';
    if (role === 'researcher') {
       response = await generateResearcherResponse(topic, history);
    } else {
       response = await generateReviewerResponse(topic, history);
    }

    const newMessage: Message = {
      id: generateId(),
      role,
      content: response,
      timestamp: Date.now()
    };

    setState(prev => {
      const updatedMessages = [...prev.messages, newMessage];
      const newTurnCount = prev.turnCount + 1;
      const isFinal = response.includes("FINAL:") || newTurnCount >= MAX_TURNS;
      
      if (isFinal) {
        setActiveAgent(null);
        return { ...prev, messages: updatedMessages, turnCount: newTurnCount, status: 'completed', finalPlan: response };
      }

      const nextRole = role === 'researcher' ? 'reviewer' : 'researcher';
      setTimeout(() => processTurn(nextRole, topic, updatedMessages), 800);

      return { ...prev, messages: updatedMessages, turnCount: newTurnCount };
    });
  };

  const resetSimulation = () => {
    setState({ topic: '', status: 'idle', turnCount: 0, maxTurns: MAX_TURNS, messages: [] });
    setTopicInput('');
    setActiveAgent(null);
  };

  const isIdle = state.status === 'idle';

  return (
    <div className="min-h-screen text-gray-200 flex flex-col relative overflow-hidden">
      <BackgroundGrid />

      {/* Navbar / Brand */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-4">
           <h1 className="font-serif-display text-2xl tracking-widest text-white">NEURAL SYNDICATE</h1>
        </div>
        <div className="flex items-center gap-3 opacity-60">
           <div className={`w-2 h-2 rounded-full ${state.status === 'running' ? 'bg-green-500 shadow-[0_0_10px_#0f0]' : 'bg-blue-500'}`} />
           <span className="text-[10px] font-mono tracking-widest">{state.status === 'idle' ? 'ONLINE' : 'PROCESSING'}</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative z-10 w-full h-full max-w-7xl mx-auto pt-24 pb-12 px-6">
        
        {/* Cinematic Hero (Transitions out) */}
        <div className={`flex flex-col items-center justify-center transition-all duration-1000 absolute inset-0 ${!isIdle ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="text-center space-y-6 max-w-3xl px-6">
             <div className="font-mono text-xs text-accent-cyan tracking-[0.3em] uppercase opacity-70 mb-2">System Architecture V.7.0</div>
             
             {/* Typewriter Title with Reset Key */}
             <TypewriterTitle 
               key={isIdle ? 'idle' : 'active'}
               lines={HERO_LINES}
               className="font-serif-display text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600 animate-float text-glow"
             />

             <p className="font-light text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
               Initiate a bounded recursive loop. <strong className="text-white">Researcher</strong> drafts. <strong className="text-white">Reviewer</strong> refines.
             </p>
          </div>
          
          {/* Input Interface */}
          <div className="mt-16 w-full max-w-lg relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg flex items-center p-2 input-glow transition-all">
              <span className="pl-4 font-mono text-cyan-400 animate-pulse">{">_"}</span>
              <input 
                type="text" 
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startSimulation()}
                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-white placeholder-gray-600 font-mono tracking-wide"
                placeholder="Enter Directive..."
              />
              <button 
                onClick={() => startSimulation()}
                disabled={!topicInput}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-mono tracking-widest rounded border border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                INIT
              </button>
            </div>
            
            {/* Suggestions */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
               {SUGGESTIONS.map(s => (
                 <button 
                   key={s} 
                   onClick={() => startSimulation(s)}
                   className="text-[10px] font-mono border border-white/5 bg-white/5 hover:bg-white/10 px-3 py-1 rounded transition-colors text-gray-400 hover:text-white uppercase tracking-wider"
                 >
                   {s}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Active Simulation View (Transitions in) */}
        <div className={`flex flex-col h-full transition-all duration-1000 ${isIdle ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
           
           {/* Agent Visualizer */}
           <div className="flex justify-between items-center px-4 md:px-20 mb-4 h-48 relative">
              {/* Connecting Beam */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              {/* Active Data Packet Animation */}
              {activeAgent && (
                <div className={`absolute top-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent blur-[2px] transition-all duration-1000 ${activeAgent === 'researcher' ? 'left-[20%] opacity-100' : 'left-[70%] opacity-100'}`} />
              )}

              <AgentAvatar agent={RESEARCHER} isActive={activeAgent === 'researcher'} isThinking={activeAgent === 'researcher'} />
              
              {/* Central Status */}
              <div className="flex flex-col items-center gap-2">
                 <Disc className={`text-white/20 ${state.status === 'running' ? 'animate-spin' : ''}`} size={24} />
                 <span className="text-[9px] font-mono tracking-[0.3em] text-white/30">DATA LINK</span>
              </div>

              <AgentAvatar agent={REVIEWER} isActive={activeAgent === 'reviewer'} isThinking={activeAgent === 'reviewer'} />
           </div>

           {/* Console */}
           <SimulationConsole messages={state.messages} status={state.status} />
           
           {/* Controls */}
           {state.status === 'completed' && (
             <div className="flex justify-center mt-8 animate-in fade-in slide-in-from-bottom-8">
               <button 
                 onClick={resetSimulation} 
                 className="group relative px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all flex items-center gap-3"
               >
                 <RefreshCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" />
                 <span className="text-xs font-mono tracking-widest">RESET PROTOCOL</span>
               </button>
             </div>
           )}
        </div>

      </main>
      
      {/* Footer */}
      <footer className="fixed bottom-6 w-full text-center pointer-events-none z-0">
        <p className="text-[10px] text-gray-700 font-mono tracking-[0.5em] opacity-50">GEMINI 2.5 NEURAL BRIDGE</p>
      </footer>
    </div>
  );
}
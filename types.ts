export type Role = 'user' | 'researcher' | 'reviewer' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  metadata?: {
    isThinking?: boolean;
    toolUsed?: string;
  };
}

export interface SimulationState {
  topic: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  turnCount: number;
  maxTurns: number;
  messages: Message[];
  finalPlan?: string;
}

export interface AgentConfig {
  name: string;
  role: Role;
  color: string;
  description: string;
  systemPrompt: string;
}
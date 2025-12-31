export enum TabType {
  FILES = 'Files',
  CLIPS = 'Clips',
  PIPES = 'Pipes',
  STATUS = 'Status'
}

export enum PipeStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface PipeDef {
  id: string;
  name: string;
  description: string;
  source: string; // e.g., "Kimi"
  target: string; // e.g., "DeepSeek"
  transformPrompt: string;
  isThinkingMode?: boolean; // Uses Gemini Pro with Thinking Budget
}

export interface Clip {
  id: string;
  content: string;
  sourceUrl: string;
  timestamp: number;
  tags: string[];
  summary?: string;
  title?: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  content: string;
}

export interface DomSelectorConfig {
  host: string[];
  input: {
    selectors: string[];
    strategy: 'waterfall' | 'heuristic';
  };
  submit: {
    selectors: string[];
  };
}

export interface RemoteConfig {
  version: string;
  lastUpdated: string;
  platforms: Record<string, DomSelectorConfig>;
  global_killswitch: boolean;
}
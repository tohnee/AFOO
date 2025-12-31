import { FileItem, PipeDef, RemoteConfig } from './types';

export const MOCK_FILES: FileItem[] = [
  { id: 'f1', name: 'Q3_Financial_Report.pdf', size: '2.4 MB', type: 'PDF', content: 'Full text of Q3 Financial Report...' },
  { id: 'f2', name: 'api_docs_v2.md', size: '15 KB', type: 'Markdown', content: '# API Documentation v2\n\n## Endpoints...' },
  { id: 'f3', name: 'user_research_notes.txt', size: '4 KB', type: 'Text', content: 'User 123 complained about the latency...' },
];

export const MOCK_PIPES: PipeDef[] = [
  {
    id: 'p1',
    name: 'Analyst Handover',
    description: 'Pipe Kimi summary to DeepSeek for code generation.',
    source: 'chat.kimi.ai',
    target: 'chat.deepseek.com',
    transformPrompt: 'Read the following summary and write a Python script to visualize the data trends using Matplotlib:',
  },
  {
    id: 'p2',
    name: 'Executive Briefing (Thinking)',
    description: 'Deep analysis of current context using Reasoning Model.',
    source: 'current',
    target: 'chat.deepseek.com', // Simulating routing to a strong model
    transformPrompt: 'Provide a strategic risk assessment based on this context. Think deeply about second-order effects.',
    isThinkingMode: true
  },
  {
    id: 'p3',
    name: 'Translation Stream',
    description: 'Convert current text to Japanese instantly.',
    source: 'current',
    target: 'translate.google.com',
    transformPrompt: 'Translate the following text to Japanese naturally:',
  }
];

export const REMOTE_CONFIG_MOCK: RemoteConfig = {
  version: "2.1.4",
  lastUpdated: new Date().toISOString(),
  global_killswitch: false,
  platforms: {
    "deepseek": {
      host: ["chat.deepseek.com"],
      input: {
        selectors: [
          "#chat-input", 
          "textarea[placeholder*='Message']",
          "//textarea[@class='dynamic-input']"
        ],
        strategy: "waterfall"
      },
      submit: {
        selectors: ["div[role='button'][aria-label='Send']"]
      }
    },
    "kimi": {
      host: ["chat.kimi.ai"],
      input: {
        selectors: [
          ".input-editor", 
          "div[contenteditable='true']"
        ],
        strategy: "heuristic"
      },
      submit: {
        selectors: ["button.send-btn"]
      }
    }
  }
};
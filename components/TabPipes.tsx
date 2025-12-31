import React, { useState } from 'react';
import { MOCK_PIPES } from '../constants';
import { PipeStatus } from '../types';
import { executeThinkingPipe } from '../services/geminiService';
import { mockChrome } from '../lib/chrome-bridge';

interface TabPipesProps {
  browserContent: string;
  // REMOVED: onRunPipe prop. We now use message passing.
}

export const TabPipes: React.FC<TabPipesProps> = ({ browserContent }) => {
  const [runningPipeId, setRunningPipeId] = useState<string | null>(null);
  const [pipeStatus, setPipeStatus] = useState<PipeStatus>(PipeStatus.IDLE);
  const [logs, setLogs] = useState<string[]>([]);

  const runPipe = async (pipeId: string) => {
    const pipe = MOCK_PIPES.find(p => p.id === pipeId);
    if (!pipe) return;

    setRunningPipeId(pipeId);
    setPipeStatus(PipeStatus.RUNNING);
    setLogs([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    try {
      addLog(`[System] Initializing Pipe: ${pipe.name}`);
      addLog(`[Extract] Capturing context from ${pipe.source}...`);
      await new Promise(r => setTimeout(r, 600)); // Sim delay
      
      const sourceData = browserContent;
      addLog(`[Extract] Success (${sourceData.length} chars)`);

      let transformedData = '';

      if (pipe.isThinkingMode) {
        addLog(`[Think] Routing to Gemini 3 Pro (Budget: 32k tokens)...`);
        addLog(`[Think] Analyzing dependencies and second-order effects...`);
        // Real API Call for Thinking Mode
        transformedData = await executeThinkingPipe(pipe.transformPrompt, sourceData);
        addLog(`[Think] Reasoning complete.`);
      } else {
        addLog(`[Transform] Applying prompt template...`);
        await new Promise(r => setTimeout(r, 400));
        transformedData = `[PIPE OUTPUT from ${pipe.source}]\n\nTask: ${pipe.transformPrompt}\n\nContext:\n${sourceData.substring(0, 200)}...\n\n(Simulated Transformed Content Ready for Injection)`;
      }

      addLog(`[Switch] Focusing tab: ${pipe.target}`);
      // In a real extension, we would use chrome.tabs.update to switch tabs here
      await new Promise(r => setTimeout(r, 500));
      
      addLog(`[Inject] Sending payload to Active Tab...`);
      
      // *** MIGRATION KEYPOINT: Sending Message ***
      // In real extension: chrome.tabs.sendMessage(tabId, { action: "INJECT_TEXT", payload: ... })
      mockChrome.sendMessageToTab(1, { 
        action: "INJECT_TEXT", 
        payload: transformedData 
      });
      
      addLog(`[Execute] Triggering send event...`);
      setPipeStatus(PipeStatus.SUCCESS);

    } catch (e) {
      addLog(`[Error] Pipe failed: ${e}`);
      setPipeStatus(PipeStatus.ERROR);
    } finally {
      setTimeout(() => {
        setRunningPipeId(null);
        setPipeStatus(PipeStatus.IDLE);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Available Pipelines</h2>
        <div className="space-y-3">
          {MOCK_PIPES.map((pipe) => (
            <div 
              key={pipe.id} 
              className={`relative border rounded-lg p-3 transition-all ${
                runningPipeId === pipe.id 
                  ? 'bg-synapse-800 border-synapse-accent shadow-[0_0_15px_rgba(0,240,255,0.1)]' 
                  : 'bg-synapse-800 border-synapse-700 hover:border-gray-500'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${pipe.isThinkingMode ? 'bg-purple-900/50 text-purple-400' : 'bg-synapse-700 text-synapse-accent'}`}>
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-200">{pipe.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                      <span>{pipe.source}</span>
                      <span>→</span>
                      <span>{pipe.target}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => runPipe(pipe.id)}
                  disabled={runningPipeId !== null}
                  className="bg-synapse-700 hover:bg-synapse-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs text-white px-3 py-1.5 rounded transition-colors"
                >
                  {runningPipeId === pipe.id ? 'Running...' : 'Execute'}
                </button>
              </div>
              <p className="text-xs text-gray-500 pl-9">{pipe.description}</p>
              
              {/* Thinking Mode Indicator */}
              {pipe.isThinkingMode && (
                <div className="absolute top-2 right-24 text-[10px] flex items-center gap-1 text-purple-400 border border-purple-900/50 bg-purple-900/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                  Deep Think
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Execution Console */}
      <div className="bg-black rounded border border-synapse-700 font-mono p-3 h-48 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] text-gray-500 border-b border-synapse-800 pb-1 mb-2 sticky top-0 bg-black">
          PIPE CONSOLE {pipeStatus !== PipeStatus.IDLE && `• ${pipeStatus.toUpperCase()}`}
        </div>
        {logs.length === 0 ? (
          <div className="text-gray-700 text-xs italic">Waiting for execution...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="text-xs mb-1">
              <span className="text-synapse-500 mr-2">{new Date().toLocaleTimeString().split(' ')[0]}</span>
              <span className={`${log.includes('[Error]') ? 'text-red-400' : log.includes('[Think]') ? 'text-purple-400' : 'text-green-400'}`}>
                {log}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
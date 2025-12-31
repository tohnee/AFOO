import React from 'react';
import { REMOTE_CONFIG_MOCK } from '../constants';

interface Props {
  currentUrl: string;
}

export const AntifragileStatus: React.FC<Props> = ({ currentUrl }) => {
  // Simple logic to find matching config
  const platformKey = Object.keys(REMOTE_CONFIG_MOCK.platforms).find(key => 
    REMOTE_CONFIG_MOCK.platforms[key].host.some(h => currentUrl.includes(h))
  );
  
  const config = platformKey ? REMOTE_CONFIG_MOCK.platforms[platformKey] : null;

  return (
    <div className="space-y-6">
      <div className="bg-synapse-800/50 rounded-lg p-4 border border-synapse-700">
        <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">DOM Engine Status</h2>
        
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${config ? 'border-synapse-success/20 text-synapse-success' : 'border-synapse-warning/20 text-synapse-warning'}`}>
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <div className="text-xl font-bold text-white">{config ? 'Operational' : 'Fallback Mode'}</div>
            <div className="text-xs text-gray-400">Target: {currentUrl}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs border-b border-synapse-700 pb-2">
             <span className="text-gray-500">Config Version</span>
             <span className="font-mono text-synapse-accent">{REMOTE_CONFIG_MOCK.version}</span>
          </div>
          <div className="flex justify-between text-xs border-b border-synapse-700 pb-2">
             <span className="text-gray-500">Last Sync</span>
             <span className="font-mono text-gray-300">Just now</span>
          </div>
          <div className="flex justify-between text-xs border-b border-synapse-700 pb-2">
             <span className="text-gray-500">Selector Strategy</span>
             <span className={`font-mono px-1.5 rounded ${config?.input.strategy === 'heuristic' ? 'bg-yellow-900/50 text-yellow-500' : 'bg-green-900/50 text-green-500'}`}>
                {config ? config.input.strategy.toUpperCase() : 'VISUAL_GUESS'}
             </span>
          </div>
        </div>
      </div>

      <div className="bg-black p-3 rounded border border-synapse-800">
        <h3 className="text-[10px] text-gray-600 font-mono mb-2">ACTIVE SELECTORS (JSON)</h3>
        <pre className="text-[10px] text-synapse-400 font-mono overflow-x-auto">
          {config ? JSON.stringify(config.input, null, 2) : "// No strict config found.\n// Using Level 3 Visual Heuristics."}
        </pre>
      </div>

      <div className="p-3 rounded border border-red-900/30 bg-red-900/10">
        <h3 className="text-xs font-bold text-red-400 mb-1">Emergency Override</h3>
        <p className="text-[10px] text-red-300/70 mb-2">If DOM parsing fails completely, upload structure to Watchtower.</p>
        <button className="w-full py-1 text-xs border border-red-800 text-red-500 rounded hover:bg-red-900/20">
          Report Broken Selector
        </button>
      </div>
    </div>
  );
};
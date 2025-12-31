import React from 'react';
import { MOCK_FILES } from '../constants';

export const TabFiles: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-400">Local Drive</h2>
        <button className="text-xs bg-synapse-700 hover:bg-synapse-600 px-2 py-1 rounded text-white border border-synapse-600">
          + Import
        </button>
      </div>

      <div className="grid gap-2">
        {MOCK_FILES.map((file) => (
          <div 
            key={file.id} 
            className="group flex items-center p-3 rounded bg-synapse-800 border border-synapse-700 hover:border-synapse-500 hover:bg-synapse-700/50 transition-all cursor-grab active:cursor-grabbing"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", file.content);
              e.dataTransfer.effectAllowed = "copy";
            }}
          >
            <div className="mr-3">
              {file.type === 'PDF' && <span className="text-red-400 text-lg">📄</span>}
              {file.type === 'Markdown' && <span className="text-blue-400 text-lg">📝</span>}
              {file.type === 'Text' && <span className="text-gray-400 text-lg">📃</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-200 truncate">{file.name}</div>
              <div className="text-xs text-gray-500">{file.size} • {file.type}</div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 hover:text-synapse-accent">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border border-dashed border-synapse-600 rounded-lg text-center">
        <p className="text-xs text-gray-500 mb-2">Drop files here to sync</p>
        <p className="text-[10px] text-synapse-400">Local Vector Store (Voy) Ready</p>
      </div>
    </div>
  );
};
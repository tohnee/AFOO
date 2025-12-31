import React, { useState } from 'react';
import { Clip } from '../types';
import { generateClipMetadata } from '../services/geminiService';

interface TabClipsProps {
  browserContent: string;
}

export const TabClips: React.FC<TabClipsProps> = ({ browserContent }) => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    setIsCapturing(true);
    const newId = Date.now().toString();
    const content = browserContent;
    
    // Optimistic UI update
    const tempClip: Clip = {
      id: newId,
      content,
      sourceUrl: 'current-page',
      timestamp: Date.now(),
      tags: ['Processing...'],
      title: 'Analyzing...'
    };
    setClips(prev => [tempClip, ...prev]);

    // Call Gemini API (Lite model)
    const metadata = await generateClipMetadata(content);
    
    setClips(prev => prev.map(c => c.id === newId ? {
      ...c,
      title: metadata.title,
      summary: metadata.summary,
      tags: metadata.tags
    } : c));
    
    setIsCapturing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-400">Smart Archive</h2>
        <button 
          onClick={handleCapture}
          disabled={isCapturing}
          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
            isCapturing 
              ? 'bg-synapse-700 text-gray-400 cursor-wait' 
              : 'bg-synapse-accent text-black hover:bg-white hover:shadow-[0_0_10px_rgba(0,240,255,0.5)]'
          }`}
        >
          {isCapturing ? (
            <span className="flex items-center gap-1">
               <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               AI Tagging
            </span>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Capture Context
            </>
          )}
        </button>
      </div>

      {clips.length === 0 && (
        <div className="text-center py-10 text-gray-600 text-xs">
          No clips archived yet.<br/>Capture the current chat context to start.
        </div>
      )}

      <div className="space-y-3">
        {clips.map((clip) => (
          <div key={clip.id} className="bg-synapse-800 border border-synapse-700 rounded p-3 hover:border-synapse-500 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-medium text-synapse-accent line-clamp-1">{clip.title}</h3>
              <span className="text-[10px] text-gray-500">{new Date(clip.timestamp).toLocaleTimeString()}</span>
            </div>
            
            <p className="text-xs text-gray-400 mb-2 line-clamp-2">
              {clip.summary || clip.content}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {clip.tags.map((tag, idx) => (
                <span key={idx} className="px-1.5 py-0.5 rounded bg-synapse-700/50 text-[10px] text-gray-300 border border-synapse-600/50">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
import React from 'react';
import { TabType } from '../types';
import { TabFiles } from './TabFiles';
import { TabClips } from './TabClips';
import { TabPipes } from './TabPipes';
import { AntifragileStatus } from './AntifragileStatus';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUrl: string;
  browserChatContent: string;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentUrl, 
  browserChatContent,
  onClose 
}) => {
  return (
    <div className="h-full flex flex-col bg-synapse-900 text-gray-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-synapse-700 bg-synapse-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-synapse-accent shadow-[0_0_8px_rgba(0,240,255,0.6)] animate-pulse"></div>
          <h1 className="font-mono font-bold text-lg text-white tracking-wider">SYNAPSE</h1>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-synapse-700 rounded text-gray-500 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-synapse-700 bg-synapse-800/50">
        {Object.values(TabType).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-widest transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-synapse-accent text-synapse-accent bg-synapse-700/30' 
                : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-synapse-700/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === TabType.FILES && <TabFiles />}
        {activeTab === TabType.CLIPS && <TabClips browserContent={browserChatContent} />}
        {activeTab === TabType.PIPES && <TabPipes browserContent={browserChatContent} />}
        {activeTab === TabType.STATUS && <AntifragileStatus currentUrl={currentUrl} />}
      </div>

      {/* Footer / Status Bar */}
      <div className="px-4 py-2 bg-synapse-900 border-t border-synapse-700 text-[10px] font-mono text-gray-500 flex justify-between items-center">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-synapse-success"></span>
          DOM Watchtower: Active
        </span>
        <span>v2.1 Antifragile</span>
      </div>
    </div>
  );
};
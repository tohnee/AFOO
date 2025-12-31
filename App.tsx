import React, { useState } from 'react';
import { MockBrowser } from './components/MockBrowser';
import { Sidebar } from './components/Sidebar';
import { ContentScript } from './components/ContentScript';
import { TabType } from './types';

const App: React.FC = () => {
  // Browser State (Simulating the Tab state)
  const [currentUrl, setCurrentUrl] = useState<string>('chat.kimi.ai');
  const [browserInputContent, setBrowserInputContent] = useState<string>('');
  const [browserChatContent, setBrowserChatContent] = useState<string>('**Kimi:** Financial Report Q3 Summary:\n\nRevenue grew by 15% YoY driven by AI adoption. Operating margins improved to 22%. Key risks include geopolitical instability and supply chain constraints.');
  
  // Extension State
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.PIPES);

  const handleSendMessage = () => {
    if (!browserInputContent.trim()) return;
    const userMsg = `\n\n**You:** ${browserInputContent}`;
    setBrowserChatContent(prev => prev + userMsg);
    const originalMsg = browserInputContent;
    setBrowserInputContent('');

    setTimeout(() => {
      const aiName = currentUrl.includes('deepseek') ? 'DeepSeek' : 'Kimi';
      const aiResponse = `\n\n**${aiName}:** [Simulated Output] "${originalMsg.substring(0, 30)}..." received.`;
      setBrowserChatContent(prev => prev + aiResponse);
    }, 800);
  };

  // Bridge Handler: When the "Content Script" decides to inject text
  const handleInjection = (text: string) => {
    // In a real app, this is document.querySelector('textarea').value = text
    setBrowserInputContent(text);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-gray-300 font-sans selection:bg-synapse-accent selection:text-black">
      
      {/* The "Content Script" acts as the glue between messages and the 'DOM' (State) */}
      <ContentScript 
        onInjectText={handleInjection} 
        onGetContent={() => browserChatContent}
      />

      {/* Mock Browser Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'mr-[400px]' : 'mr-0'}`}>
        <MockBrowser 
          url={currentUrl} 
          setUrl={setCurrentUrl}
          chatContent={browserChatContent}
          setChatContent={setBrowserChatContent}
          inputContent={browserInputContent}
          setInputContent={setBrowserInputContent}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Synapse Sidebar Overlay/Dock */}
      <div 
        className={`fixed right-0 top-0 bottom-0 width-[400px] bg-synapse-900 border-l border-synapse-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: '400px' }}
      >
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          currentUrl={currentUrl}
          browserChatContent={browserChatContent}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
    </div>
  );
};

export default App;
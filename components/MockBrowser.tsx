import React from 'react';

interface MockBrowserProps {
  url: string;
  setUrl: (url: string) => void;
  chatContent: string;
  setChatContent: (content: string) => void;
  inputContent: string;
  setInputContent: (content: string) => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  onSendMessage: () => void;
}

export const MockBrowser: React.FC<MockBrowserProps> = ({ 
  url, setUrl, chatContent, setChatContent, inputContent, setInputContent, toggleSidebar, isSidebarOpen, onSendMessage
}) => {
  
  const isDeepSeek = url.includes('deepseek');
  const themeBg = isDeepSeek ? 'bg-[#181a20]' : 'bg-[#f5f5f7]'; // DeepSeek dark, Kimi light
  const themeText = isDeepSeek ? 'text-gray-200' : 'text-gray-800';
  const themeInput = isDeepSeek ? 'bg-[#2b2d31] border-gray-700 text-white' : 'bg-white border-gray-300 text-black';

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Mock Browser URL Bar */}
      <div className="h-10 bg-gray-200 flex items-center px-4 gap-2 border-b border-gray-300 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 flex gap-2">
            <select 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-white h-7 rounded text-xs px-2 text-gray-600 focus:outline-none border border-gray-300"
            >
                <option value="chat.kimi.ai">chat.kimi.ai</option>
                <option value="chat.deepseek.com">chat.deepseek.com</option>
                <option value="claude.ai">claude.ai</option>
            </select>
        </div>
        
        {/* Synapse Extension Icon in Toolbar */}
        <button 
          onClick={toggleSidebar}
          className={`p-1.5 rounded transition-colors ${isSidebarOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-300 text-gray-600'}`}
          title="Toggle Synapse"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </button>
      </div>

      {/* Mock Website Content */}
      <div className={`flex-1 flex flex-col relative ${themeBg} ${themeText}`}>
        {/* Header */}
        <div className={`h-12 border-b flex items-center px-6 font-semibold ${isDeepSeek ? 'border-gray-800' : 'border-gray-200'}`}>
          {isDeepSeek ? 'DeepSeek-V3' : 'Kimi Chat'}
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className={`max-w-3xl mx-auto space-y-6`}>
            {/* Chat Log */}
            <div className="flex justify-start w-full">
              <div className={`px-4 py-3 rounded-2xl max-w-full w-full text-sm whitespace-pre-wrap ${isDeepSeek ? 'bg-[#2b2d31]' : 'bg-white shadow-sm border border-gray-200'}`}>
                {chatContent}
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 shrink-0">
          <div className="max-w-3xl mx-auto relative">
             <textarea 
                className={`w-full h-32 rounded-xl p-4 resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${themeInput}`}
                placeholder={isDeepSeek ? "Send a message..." : "Enter your query..."}
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSendMessage();
                  }
                }}
                // This ID matches the remote config in constants.ts
                id={isDeepSeek ? "chat-input" : undefined} 
             ></textarea>
             
             <div className="absolute bottom-4 right-4 flex gap-2">
               <button 
                 onClick={onSendMessage}
                 className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
               >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
               </button>
             </div>
          </div>
          
          <div className="text-center mt-2 text-xs opacity-40">
            Synapse Overlay Active • Drag files directly into input
          </div>
        </div>
      </div>
    </div>
  );
};
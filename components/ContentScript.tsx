import { useEffect } from 'react';
import { mockChrome, ExtensionMessage } from '../lib/chrome-bridge';

interface ContentScriptProps {
  onInjectText: (text: string) => void;
  onGetContent: () => string;
}

/**
 * ContentScript Component
 * 
 * In a real extension, this code resides in `content.ts`.
 * It listens for messages from the sidebar and manipulates the DOM.
 * 
 * Here, it listens to the mockChrome bridge and calls the setters provided by MockBrowser.
 */
export const ContentScript: React.FC<ContentScriptProps> = ({ onInjectText, onGetContent }) => {
  
  useEffect(() => {
    const handleMessage = (message: any, sender: any, sendResponse: any) => {
      const msg = message as ExtensionMessage;

      switch (msg.action) {
        case "INJECT_TEXT":
          // Logic: "Antifragile" selector matching would go here in real extension
          // For now, we simulate inserting text into the active input
          console.log("[ContentScript] Received injection request");
          onInjectText(msg.payload);
          break;

        case "GET_PAGE_CONTENT":
          // Logic: Scrape the page
          const content = onGetContent();
          sendResponse({ content });
          break;
      }
    };

    mockChrome.onMessage.addListener(handleMessage);

    return () => {
      mockChrome.onMessage.removeListener(handleMessage);
    };
  }, [onInjectText, onGetContent]);

  return null; // Headless component
};
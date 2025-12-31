import { mockChrome } from './lib/chrome-bridge';

declare const chrome: any;

// This script runs directly on the page (e.g., chat.kimi.ai)
console.log("Synapse Content Script Loaded");

// Listen for messages from the Sidebar (via background or direct)
chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
  if (request.action === "INJECT_TEXT") {
    injectTextToChatbot(request.payload);
  }
  return true;
});

function injectTextToChatbot(text: string) {
  // 1. Antifragile DOM Strategy
  // In a real build, we would load 'selectors.json' from remote config here.
  // For now, we use a robust waterfall list.
  const possibleSelectors = [
    "#chat-input",                      // DeepSeek ID
    "textarea[placeholder*='Message']", // Generic
    "div[contenteditable='true']",      // Kimi / Rich Text Editors
    ".input-editor",                    // Kimi Class
    "textarea"                          // Fallback
  ];

  let inputEl: HTMLElement | null = null;

  for (const sel of possibleSelectors) {
    inputEl = document.querySelector(sel) as HTMLElement;
    if (inputEl) {
      console.log(`[Synapse] Selector matched: ${sel}`);
      break;
    }
  }

  // 2. Simulate Native Input
  if (inputEl) {
    inputEl.focus();

    // Handle ContentEditable (Kimi)
    if (inputEl.isContentEditable) {
      inputEl.textContent = text; 
    } 
    // Handle Textarea (DeepSeek / Standard)
    else if (inputEl instanceof HTMLTextAreaElement) {
      // React/Vue frameworks often override the value setter, so we must call the native one
      const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
      if (nativeTextAreaValueSetter) {
        nativeTextAreaValueSetter.call(inputEl, text);
      } else {
        inputEl.value = text;
      }
    }

    // 3. Trigger Events to wake up UI frameworks (React/Vue)
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    inputEl.dispatchEvent(new Event('change', { bubbles: true }));
    
    console.log("[Synapse] Text injected successfully");
  } else {
    console.error("[Synapse] DOM Error: No chat input found. Reporting to Watchtower...");
  }
}
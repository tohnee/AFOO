// Declare chrome global to fix type errors
declare const chrome: any;

/**
 * Chrome Extension Isomorphic Bridge
 * 
 * This bridge automatically detects the environment:
 * 1. REAL MODE: If `chrome.runtime` exists, it calls actual Chrome APIs.
 * 2. MOCK MODE: If not, it uses an internal event bus for the web simulation.
 */

// Detect if we are running in a real Chrome Extension environment
const isExtension = typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.onMessage;

type MessageListener = (message: any, sender: any, sendResponse: (response?: any) => void) => void;

class ChromeBridge {
  private mockListeners: MessageListener[] = [];

  constructor() {
    if (isExtension) {
      console.log('[[Synapse Bridge]] Running in EXTENSION mode.');
    } else {
      console.log('[[Synapse Bridge]] Running in SIMULATOR mode.');
    }
  }

  // --- Event Listener Wrapper ---
  onMessage = {
    addListener: (callback: MessageListener) => {
      if (isExtension) {
        chrome.runtime.onMessage.addListener(callback);
      } else {
        this.mockListeners.push(callback);
      }
    },
    removeListener: (callback: MessageListener) => {
      if (isExtension) {
        chrome.runtime.onMessage.removeListener(callback);
      } else {
        this.mockListeners = this.mockListeners.filter(l => l !== callback);
      }
    }
  };

  // --- Sender Wrapper ---
  
  /**
   * Sends a message to the currently active tab (Content Script).
   */
  sendMessageToActiveTab = (message: any) => {
    if (isExtension) {
      // Real API: Query active tab -> Send Message
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        if (tabs[0]?.id) {
          console.log('[[Synapse Bridge]] Sending to Tab ID:', tabs[0].id, message);
          chrome.tabs.sendMessage(tabs[0].id, message).catch((err: any) => {
             // Swallow error if content script isn't ready (common in dev)
             console.warn('Content script not ready yet:', err);
          });
        }
      });
    } else {
      // Mock API: Broadcast to internal listeners (The ContentScript component)
      console.log('[[Synapse Bridge]] Mock Broadcast:', message);
      this.mockListeners.forEach(listener => {
        listener(message, { id: 'mock-sender' }, (response) => {
          console.log('[[Synapse Bridge]] Mock Response:', response);
        });
      });
    }
  };

  /**
   * Sends a message to the Background Script or Side Panel.
   */
  sendMessageToRuntime = (message: any) => {
    if (isExtension) {
      chrome.runtime.sendMessage(message);
    } else {
      // In simulator, everything is in one memory space, so we just treat it as a tab message for now
      this.sendMessageToActiveTab(message);
    }
  };
}

export const mockChrome = new ChromeBridge();

// Helper Types for our specific app messages
export type ExtensionMessage = 
  | { action: "INJECT_TEXT"; payload: string }
  | { action: "GET_PAGE_CONTENT" };
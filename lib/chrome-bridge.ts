/**
 * Chrome Extension API Mock
 * 
 * This file simulates the message passing between the Extension (Sidebar)
 * and the Content Script (Browser Page).
 * 
 * In a real extension, this would be replaced by actual chrome.runtime.sendMessage
 * and chrome.tabs.sendMessage calls.
 */

type MessageListener = (message: any, sender: any, sendResponse: (response?: any) => void) => void;

class ChromeBridge {
  private listeners: MessageListener[] = [];

  // Simulate chrome.runtime.onMessage.addListener
  onMessage = {
    addListener: (callback: MessageListener) => {
      this.listeners.push(callback);
    },
    removeListener: (callback: MessageListener) => {
      this.listeners = this.listeners.filter(l => l !== callback);
    }
  };

  // Simulate chrome.tabs.sendMessage (Sending from Sidebar -> Content Script)
  sendMessageToTab = (tabId: number, message: any) => {
    console.log('[ChromeBridge] Extension sent message:', message);
    // In our single-page mock, we broadcast to all listeners
    this.listeners.forEach(listener => {
      listener(message, { id: 'mock-sender' }, (response) => {
        console.log('[ChromeBridge] Response received:', response);
      });
    });
  };

  // Simulate chrome.runtime.sendMessage (Sending from Content Script -> Extension/Background)
  sendMessageToBackground = (message: any) => {
    // For now, we reuse the same bus, but logically this flows the other way
    this.sendMessageToTab(0, message); 
  };
}

export const mockChrome = new ChromeBridge();

// Helper Types for our specific app messages
export type ExtensionMessage = 
  | { action: "INJECT_TEXT"; payload: string }
  | { action: "GET_PAGE_CONTENT" };

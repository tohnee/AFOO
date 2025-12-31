// This file runs in the background of the Chrome Extension

declare const chrome: any;

// Enable the side panel to open when the extension icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: any) => console.error(error));

// Optional: Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Synapse: The Neuro-Pipe installed.");
});
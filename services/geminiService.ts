import { GoogleGenAI, Type } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Feature: Fast AI responses (using gemini-flash-lite-latest)
// Used for: Auto-Tagging and Summarization of Clips
export const generateClipMetadata = async (content: string) => {
  if (!apiKey) return { title: 'No API Key', tags: ['error'], summary: 'Configure API Key in env' };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest', // Low latency model
      contents: `Analyze the following text snippet. Provide a short Title, a 1-sentence Summary, and 3-5 relevant Tags.
      
      Text: "${content.substring(0, 1000)}..."`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Gemini Lite Error:", error);
    return { title: 'Analysis Failed', tags: ['error'], summary: 'Failed to generate metadata' };
  }
};

// Feature: Think more when needed (using gemini-3-pro-preview with thinking budget)
// Used for: Complex Pipe Transformation ("Deep Analysis")
export const executeThinkingPipe = async (prompt: string, context: string) => {
  if (!apiKey) return "Error: API Key missing.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        Context: ${context}
        
        Task: ${prompt}
        
        Please provide a comprehensive and deeply reasoned output.
      `,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768 // Max budget for deep reasoning
        }
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Pro Thinking Error:", error);
    return "Error executing thinking pipe. Please check console.";
  }
};
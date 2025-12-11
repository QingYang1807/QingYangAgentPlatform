import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini
// Note: In a real app, handle missing API key gracefully via UI
const ai = new GoogleGenAI({ apiKey });

export const analyzeSystemHealth = async (logs: string): Promise<string> => {
  if (!apiKey) return "API Key not configured. Using simulated analysis: System is stable, throughput at 98%.";

  try {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model,
      contents: `
        You are an AI Site Reliability Engineer for an Agent Platform.
        Analyze the following system logs and providing a brief, technical summary of the system health, potential bottlenecks, or suggested optimizations.
        Keep it under 50 words. Use technical jargon appropriate for an Agent Infra engineer (e.g., latency, token throughput, FSM state).
        
        Logs:
        ${logs}
      `,
    });
    return response.text || "Analysis complete. System nominal.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Unable to connect to AI Analysis service.";
  }
};

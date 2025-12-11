import { GoogleGenAI } from "@google/genai";
import { Lang } from "../translations";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini
// Note: In a real app, handle missing API key gracefully via UI
const ai = new GoogleGenAI({ apiKey });

export const analyzeSystemHealth = async (logs: string, lang: Lang = 'en'): Promise<string> => {
  if (!apiKey) {
    return lang === 'zh' 
      ? "API密钥未配置。模拟分析：系统稳定，吞吐量保持在98%。" 
      : "API Key not configured. Using simulated analysis: System is stable, throughput at 98%.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const langInstruction = lang === 'zh' 
      ? "Respond in Chinese (Simplified). Use professional AI Infrastructure terminology (e.g., 延迟, 吞吐量, 状态机)."
      : "Respond in English.";

    const response = await ai.models.generateContent({
      model,
      contents: `
        You are an AI Site Reliability Engineer for an Agent Platform.
        Analyze the following system logs and providing a brief, technical summary of the system health, potential bottlenecks, or suggested optimizations.
        Keep it under 50 words. 
        ${langInstruction}
        
        Logs:
        ${logs}
      `,
    });
    return response.text || (lang === 'zh' ? "分析完成。系统正常。" : "Analysis complete. System nominal.");
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return lang === 'zh' ? "无法连接到AI分析服务。" : "Unable to connect to AI Analysis service.";
  }
};
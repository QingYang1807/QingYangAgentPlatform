import { GoogleGenAI, Type } from "@google/genai";
import { Lang } from "../translations";
import { AgentConfig } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini
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

export const generateAgentConfiguration = async (userDescription: string, lang: Lang): Promise<AgentConfig> => {
    if (!apiKey) {
        // Fallback mock for no API key
        return {
            name: "Mock Agent",
            role: "Assistant",
            description: "API Key missing. This is a mock agent.",
            systemPrompt: "You are a helpful assistant.",
            model: "gemini-2.5-flash",
            temperature: 0.7,
            tools: ["google_search"]
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a professional Agent configuration based on this user description: "${userDescription}".
                       The output must be in ${lang === 'zh' ? 'Chinese' : 'English'}.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "A creative and professional name for the agent" },
                        role: { type: Type.STRING, description: "Short role title (e.g., Financial Analyst)" },
                        description: { type: Type.STRING, description: "A brief description of what the agent does" },
                        systemPrompt: { type: Type.STRING, description: "A detailed, professional system instruction (prompt) for the LLM" },
                        model: { type: Type.STRING, description: "Recommended model (e.g., gemini-2.5-flash, gemini-3-pro-preview)" },
                        temperature: { type: Type.NUMBER, description: "Recommended temperature (0.0 to 1.0)" },
                        tools: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "List of recommended tools (e.g., google_search, code_interpreter, data_retriever)" 
                        }
                    },
                    required: ["name", "role", "description", "systemPrompt", "model", "temperature", "tools"]
                }
            }
        });

        const json = JSON.parse(response.text || "{}");
        return json as AgentConfig;

    } catch (e) {
        console.error("Agent generation failed", e);
        throw e;
    }
}
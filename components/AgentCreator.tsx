import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Save, Settings2, Code, Terminal } from 'lucide-react';
import { Lang, translations } from '../translations';
import { generateAgentConfiguration } from '../services/geminiService';
import { AgentConfig, ChatMessage } from '../types';

interface AgentCreatorProps {
  lang: Lang;
}

export const AgentCreator: React.FC<AgentCreatorProps> = ({ lang }) => {
  const t = translations[lang].creator;
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: lang === 'zh' ? '你好！我是您的智能体架构师。请告诉我您想创建什么样的智能体？' : 'Hello! I am your Agent Architect. What kind of agent would you like to build today?' }
  ]);
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      // 1. Generate Config
      const config = await generateAgentConfiguration(userMsg, lang);
      setAgentConfig(config);

      // 2. Respond
      const reply = lang === 'zh' 
        ? `我已经为您设计了 **${config.name}**。右侧面板显示了详细配置，包括系统指令和工具链。您可以继续修改它。`
        : `I have architected **${config.name}** for you. The detailed configuration, including system instructions and toolchain, is shown in the right panel.`;
      
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: lang === 'zh' ? '抱歉，架构生成服务暂时不可用。' : 'Sorry, the architect service is temporarily unavailable.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex gap-6 animate-in fade-in duration-500">
      
      {/* Left Column: Chat Interface */}
      <div className="w-1/2 flex flex-col bg-nexus-800 rounded-lg border border-nexus-700 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-nexus-700 bg-nexus-900 flex items-center gap-2">
           <Sparkles className="text-nexus-purple" size={18} />
           <h3 className="font-bold text-white">{t.title}</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               {msg.role === 'assistant' && (
                 <div className="w-8 h-8 rounded bg-nexus-purple/20 flex items-center justify-center shrink-0 border border-nexus-purple/30">
                   <Bot size={16} className="text-nexus-purple" />
                 </div>
               )}
               <div className={`p-3 rounded-lg max-w-[85%] text-sm leading-relaxed ${
                 msg.role === 'user' 
                   ? 'bg-nexus-600 text-white rounded-tr-none' 
                   : 'bg-nexus-900 border border-nexus-700 text-gray-300 rounded-tl-none'
               }`}>
                 {msg.content}
               </div>
               {msg.role === 'user' && (
                 <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center shrink-0">
                   <User size={16} className="text-gray-300" />
                 </div>
               )}
            </div>
          ))}
          {isTyping && (
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded bg-nexus-purple/20 flex items-center justify-center border border-nexus-purple/30">
                  <Bot size={16} className="text-nexus-purple animate-pulse" />
               </div>
               <div className="text-xs text-gray-500 flex items-center">{t.thinking}</div>
             </div>
          )}
        </div>

        <div className="p-4 bg-nexus-900 border-t border-nexus-700">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.inputPlaceholder}
              className="w-full bg-nexus-800 border border-nexus-600 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent transition-all placeholder-gray-500"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-nexus-accent hover:bg-nexus-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Agent Configuration Preview */}
      <div className="w-1/2 bg-nexus-800 rounded-lg border border-nexus-700 flex flex-col shadow-xl overflow-hidden">
        <div className="p-4 border-b border-nexus-700 bg-nexus-900 flex justify-between items-center">
           <h3 className="font-bold text-white flex items-center gap-2">
             <Settings2 size={18} className="text-nexus-success" />
             {t.previewTitle}
           </h3>
           {agentConfig && (
             <button className="flex items-center gap-2 px-3 py-1.5 bg-nexus-success/10 text-nexus-success border border-nexus-success/30 rounded text-xs font-bold hover:bg-nexus-success/20 transition">
               <Save size={14} />
               {t.save}
             </button>
           )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {agentConfig ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              {/* Header Card */}
              <div className="flex gap-4 items-start">
                 <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-nexus-purple to-blue-600 flex items-center justify-center shrink-0 shadow-lg">
                    <Bot size={32} className="text-white" />
                 </div>
                 <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">{agentConfig.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="px-2 py-0.5 rounded text-xs font-mono bg-nexus-700 text-gray-300 border border-nexus-600">{agentConfig.role}</span>
                       <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-900/30 text-blue-400 border border-blue-800">{agentConfig.model}</span>
                       <span className="px-2 py-0.5 rounded text-xs font-mono bg-orange-900/30 text-orange-400 border border-orange-800">T={agentConfig.temperature}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{agentConfig.description}</p>
                 </div>
              </div>

              {/* Tools Section */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <Terminal size={14} /> {t.tools}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {agentConfig.tools.map((tool, i) => (
                    <span key={i} className="px-3 py-1.5 rounded bg-nexus-900 border border-nexus-600 text-xs font-mono text-nexus-accent flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-nexus-accent"></div>
                      {tool}
                    </span>
                  ))}
                  <button className="px-3 py-1.5 rounded bg-nexus-900/50 border border-dashed border-nexus-600 text-xs text-gray-500 hover:text-white hover:border-gray-400 transition">
                    + Add Tool
                  </button>
                </div>
              </div>

              {/* System Prompt Section */}
              <div className="flex-1 flex flex-col">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Code size={14} /> {t.generatedPrompt}
                </h4>
                <div className="bg-[#0d1117] border border-nexus-700 rounded-lg p-4 font-mono text-xs text-gray-300 leading-relaxed overflow-x-auto shadow-inner relative group">
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs text-gray-500 hover:text-white bg-nexus-800 px-2 py-1 rounded">Copy</button>
                   </div>
                   <pre className="whitespace-pre-wrap">{agentConfig.systemPrompt}</pre>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-nexus-600 opacity-50 space-y-4">
               <div className="w-20 h-20 rounded-full border-4 border-dashed border-nexus-700 flex items-center justify-center">
                  <Settings2 size={32} />
               </div>
               <p className="text-sm font-mono text-center max-w-[200px]">
                 {lang === 'zh' ? '在此处等待智能体配置生成...' : 'Waiting for Agent configuration...'}
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
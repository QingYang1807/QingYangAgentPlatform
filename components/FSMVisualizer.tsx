import React, { useEffect, useState } from 'react';
import { AgentNode, AgentStatus } from '../types';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { Lang, translations } from '../translations';

interface FSMVisualizerProps {
  lang: Lang;
}

const getInitialNodes = (t: any): AgentNode[] => [
  { id: 'start', label: t.nodes.start, type: 'start', status: AgentStatus.COMPLETED, x: 50, y: 200 },
  { id: 'planner', label: t.nodes.planner, type: 'planner', status: AgentStatus.EXECUTING, x: 250, y: 200 },
  { id: 'executor_sql', label: t.nodes.executor_sql, type: 'executor', status: AgentStatus.IDLE, x: 500, y: 100 },
  { id: 'executor_rag', label: t.nodes.executor_rag, type: 'executor', status: AgentStatus.IDLE, x: 500, y: 300 },
  { id: 'aggregator', label: t.nodes.aggregator, type: 'reviewer', status: AgentStatus.IDLE, x: 750, y: 200 },
  { id: 'end', label: t.nodes.end, type: 'end', status: AgentStatus.IDLE, x: 950, y: 200 },
];

export const FSMVisualizer: React.FC<FSMVisualizerProps> = ({ lang }) => {
  const t = translations[lang].fsm;
  const [nodes, setNodes] = useState<AgentNode[]>(getInitialNodes(t));
  const [isRunning, setIsRunning] = useState(true);

  // Update labels when language changes, preserving status
  useEffect(() => {
    setNodes(prevNodes => {
      const newLabels = getInitialNodes(t);
      return prevNodes.map((node, idx) => ({
        ...node,
        label: newLabels[idx].label
      }));
    });
  }, [lang]);

  // Simulate execution flow
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setNodes((prev) => {
        const newNodes = [...prev];
        // Simple mock logic to rotate statuses for visual effect
        const activeIndex = newNodes.findIndex(n => n.status === AgentStatus.EXECUTING);
        
        if (activeIndex !== -1) {
            newNodes[activeIndex].status = AgentStatus.COMPLETED;
            
            // Determine next nodes
            if (newNodes[activeIndex].id === 'planner') {
                // Fork execution
                newNodes[2].status = AgentStatus.EXECUTING; // SQL
                newNodes[3].status = AgentStatus.EXECUTING; // RAG
            } else if (newNodes[activeIndex].id === 'executor_sql' || newNodes[activeIndex].id === 'executor_rag') {
                // Join (only if both done in real life, simplified here)
                if (newNodes[2].status === AgentStatus.COMPLETED && newNodes[3].status === AgentStatus.COMPLETED) {
                     newNodes[4].status = AgentStatus.EXECUTING; // Aggregator
                } else if (newNodes[activeIndex].id === 'executor_sql' && newNodes[3].status === AgentStatus.IDLE) {
                     // Force RAG to finish for demo
                     newNodes[3].status = AgentStatus.COMPLETED;
                     newNodes[4].status = AgentStatus.EXECUTING;
                }
            } else if (newNodes[activeIndex].id === 'aggregator') {
                newNodes[5].status = AgentStatus.EXECUTING;
            } else if (newNodes[activeIndex].id === 'end') {
                // Reset loop
                newNodes.forEach(n => n.status = AgentStatus.IDLE);
                newNodes[0].status = AgentStatus.COMPLETED;
                newNodes[1].status = AgentStatus.EXECUTING;
            }
        } else {
             newNodes[1].status = AgentStatus.EXECUTING;
        }
        return newNodes;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isRunning]);

  const getNodeColor = (status: AgentStatus, type: string) => {
    if (status === AgentStatus.EXECUTING) return 'border-nexus-accent bg-nexus-accent/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse';
    if (status === AgentStatus.COMPLETED) return 'border-nexus-success bg-nexus-success/10 text-gray-300';
    if (status === AgentStatus.ERROR) return 'border-nexus-error bg-nexus-error/10';
    return 'border-nexus-600 bg-nexus-800 text-gray-500';
  };

  return (
    <div className="h-full flex flex-col bg-nexus-900">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <NetworkIcon /> {t.title}
           </h2>
           <p className="text-sm text-gray-400 font-mono mt-1">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 bg-nexus-800 border border-nexus-600 rounded hover:bg-nexus-700 text-white transition"
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button 
             onClick={() => setNodes(getInitialNodes(t))}
             className="p-2 bg-nexus-800 border border-nexus-600 rounded hover:bg-nexus-700 text-white transition"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-nexus-900 border border-nexus-700 rounded-lg relative overflow-hidden group">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

        {/* Connections (SVG Layer) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#4B5563" />
            </marker>
          </defs>
          {/* Hardcoded paths for this demo layout */}
          <path d="M 150 200 L 250 200" stroke="#4B5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <path d="M 350 200 C 400 200, 400 100, 500 100" stroke="#4B5563" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />
          <path d="M 350 200 C 400 200, 400 300, 500 300" stroke="#4B5563" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />
          <path d="M 600 100 C 650 100, 650 200, 750 200" stroke="#4B5563" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />
          <path d="M 600 300 C 650 300, 650 200, 750 200" stroke="#4B5563" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />
          <path d="M 850 200 L 950 200" stroke="#4B5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute px-4 py-3 rounded-lg border-2 font-mono text-sm font-semibold transition-all duration-300 flex flex-col items-center gap-1 min-w-[120px] ${getNodeColor(node.status, node.type)}`}
            style={{ 
                left: node.x, 
                top: node.y, 
                transform: 'translate(-50%, -50%)',
                zIndex: 10
            }}
          >
            <div className="flex items-center gap-2">
              {node.type === 'planner' && <Zap size={14} />}
              {node.label}
            </div>
            <span className="text-[10px] uppercase opacity-70 tracking-wider">{node.status}</span>
            {node.status === AgentStatus.EXECUTING && (
               <div className="absolute -bottom-6 text-xs text-nexus-accent animate-bounce">
                  Thinking...
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const NetworkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
);
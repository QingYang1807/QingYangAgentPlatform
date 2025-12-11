import React, { useEffect, useRef, useState } from 'react';
import { LogEntry } from '../types';

export const EventStream: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const components = ['Planner', 'Reviewer', 'ToolExecutor', 'KafkaConsumer', 'RAGService'];
    const levels: ('INFO' | 'WARN' | 'DEBUG')[] = ['INFO', 'INFO', 'INFO', 'DEBUG', 'WARN'];
    
    const messages = [
      "Processing DAG node: n_492a",
      "Retrieving context from VectorDB (Milvus) collection: knowledge_base_v2",
      "Function Call detected: get_sql_schema(table='users')",
      "Ontology mapped: Entity 'User' -> 'orders' relation validated",
      "Latency spike detected in embedding service (250ms)",
      "Agent State transition: THINKING -> EXECUTING",
      "Throughput: 1540 tpm (tokens per minute)",
    ];

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        level: levels[Math.floor(Math.random() * levels.length)],
        source: components[Math.floor(Math.random() * components.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      };

      setLogs((prev) => [...prev.slice(-49), newLog]); // Keep last 50
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-full flex flex-col bg-nexus-800 border border-nexus-700 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-nexus-700 bg-nexus-900 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-200 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          LIVE EVENT STREAM (Kafka Topic: agent-events-prod)
        </h3>
        <span className="text-xs text-nexus-600 font-mono">buffer: 50 lines</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 bg-[#0d1117]">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 hover:bg-white/5 p-1 rounded">
            <span className="text-gray-500 shrink-0">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
            <span className={`shrink-0 font-bold w-12 ${
              log.level === 'INFO' ? 'text-nexus-accent' : 
              log.level === 'WARN' ? 'text-nexus-warning' : 'text-nexus-error'
            }`}>
              {log.level}
            </span>
            <span className="text-nexus-purple shrink-0 w-28">{log.source}</span>
            <span className="text-gray-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

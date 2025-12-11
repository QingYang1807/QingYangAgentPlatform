import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { FSMVisualizer } from './components/FSMVisualizer';
import { OntologyGraph } from './components/OntologyGraph';
import { EventStream } from './components/EventStream';
import { analyzeSystemHealth } from './services/geminiService';
import { 
  Activity, 
  Database, 
  Zap, 
  Server, 
  Sparkles 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data for Charts
const data = [
  { name: '00:00', throughput: 4000, latency: 240 },
  { name: '04:00', throughput: 3000, latency: 139 },
  { name: '08:00', throughput: 2000, latency: 980 },
  { name: '12:00', throughput: 2780, latency: 390 },
  { name: '16:00', throughput: 1890, latency: 480 },
  { name: '20:00', throughput: 2390, latency: 380 },
  { name: '24:00', throughput: 3490, latency: 430 },
];

const StatCard: React.FC<{ title: string; value: string; change: string; icon: React.FC<any>; color: string }> = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-nexus-800 p-6 rounded-lg border border-nexus-700 relative overflow-hidden group hover:border-nexus-600 transition-colors">
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon size={64} />
    </div>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg bg-nexus-900 ${color.replace('text-', 'text-opacity-80 ')}`}>
        <Icon size={20} className={color} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className="text-nexus-success font-medium">{change}</span>
      <span className="text-gray-500 ml-2">vs last hour</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [aiInsight, setAiInsight] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate log snapshot
    const logSnapshot = "System Throughput: 2450 req/sec. Average Latency: 145ms. VectorDB Cache Hit Rate: 92%. Active Agents: 342. Error Rate: 0.4%.";
    const insight = await analyzeSystemHealth(logSnapshot);
    setAiInsight(insight);
    setIsAnalyzing(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Pipeline Throughput" value="1.2M req/day" change="+12.5%" icon={Activity} color="text-nexus-accent" />
              <StatCard title="Active Agents" value="342" change="+4" icon={Zap} color="text-nexus-purple" />
              <StatCard title="VectorDB Latency (P99)" value="145ms" change="-12ms" icon={Database} color="text-nexus-success" />
              <StatCard title="Ontology Entities" value="1,402" change="+24" icon={Server} color="text-nexus-warning" />
            </div>

            {/* Main Visuals Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
              {/* Chart */}
              <div className="lg:col-span-2 bg-nexus-800 p-6 rounded-lg border border-nexus-700 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-4">Pipeline Throughput (Token Velocity)</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                      <XAxis dataKey="name" stroke="#9CA3AF" tick={{fontSize: 12}} />
                      <YAxis stroke="#9CA3AF" tick={{fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                        itemStyle={{ color: '#3B82F6' }}
                      />
                      <Area type="monotone" dataKey="throughput" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorThroughput)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Insight Panel */}
              <div className="bg-nexus-800 p-6 rounded-lg border border-nexus-700 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-nexus-purple" size={18} />
                    Gemini Copilot
                  </h3>
                  <button 
                    onClick={handleAiAnalysis}
                    disabled={isAnalyzing}
                    className="text-xs px-3 py-1 bg-nexus-purple/20 text-nexus-purple border border-nexus-purple/50 rounded hover:bg-nexus-purple/30 transition disabled:opacity-50"
                  >
                    {isAnalyzing ? "Thinking..." : "Analyze Infra"}
                  </button>
                </div>
                <div className="flex-1 bg-nexus-900 rounded p-4 font-mono text-sm text-gray-300 leading-relaxed border border-nexus-700 overflow-y-auto">
                   {aiInsight ? (
                     <div className="typewriter">
                        <span className="text-nexus-purple mr-2">{'>'}</span>
                        {aiInsight}
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-gray-600">
                       <p>System operational.</p>
                       <p className="text-xs mt-2">Click Analyze to run diagnostics.</p>
                     </div>
                   )}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[300px]">
               <FSMVisualizer />
               <EventStream />
            </div>
          </div>
        );
      case 'orchestration':
        return <div className="h-[calc(100vh-100px)] p-6"><FSMVisualizer /></div>;
      case 'ontology':
        return <div className="h-[calc(100vh-100px)] p-6"><OntologyGraph /></div>;
      case 'logs':
        return <div className="h-[calc(100vh-100px)] p-6"><EventStream /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-nexus-900 text-gray-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-8">
          <div>
             <h2 className="text-2xl font-bold text-white tracking-tight">
               {activeView === 'dashboard' && 'Infrastructure Overview'}
               {activeView === 'orchestration' && 'Multi-Agent Orchestrator'}
               {activeView === 'ontology' && 'Enterprise Ontology'}
               {activeView === 'logs' && 'Real-time Trace'}
             </h2>
             <p className="text-gray-400 mt-1">
               Connected to cluster <span className="text-nexus-success font-mono">k8s-prod-agent-01</span>
             </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-nexus-800 rounded-full border border-nexus-700">
                <div className="w-2 h-2 rounded-full bg-nexus-success animate-pulse"></div>
                <span className="text-xs font-medium text-gray-300">System Healthy</span>
             </div>
             <img src="https://picsum.photos/40/40" alt="Profile" className="w-10 h-10 rounded-full border-2 border-nexus-700" />
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;

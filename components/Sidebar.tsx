import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  Share2, 
  TerminalSquare, 
  Settings, 
  Cpu,
  Globe
} from 'lucide-react';
import { Lang, translations } from '../translations';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, lang, setLang }) => {
  const t = translations[lang].sidebar;

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'orchestration', label: t.orchestration, icon: Network },
    { id: 'ontology', label: t.ontology, icon: Share2 },
    { id: 'logs', label: t.logs, icon: TerminalSquare },
  ];

  return (
    <div className="w-64 bg-nexus-900 border-r border-nexus-700 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-3 border-b border-nexus-700">
        <div className="w-8 h-8 bg-nexus-purple rounded-lg flex items-center justify-center shrink-0">
          <Cpu className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white whitespace-nowrap">QingYang<span className="text-nexus-purple">.AI</span></h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
              activeView === item.id 
                ? 'bg-nexus-800 text-nexus-accent border-l-2 border-nexus-accent shadow-lg shadow-black/20' 
                : 'text-gray-400 hover:bg-nexus-800 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-nexus-700">
        {/* Language Toggle */}
        <div className="flex bg-nexus-800 p-1 rounded-md mb-4 border border-nexus-600">
           <button 
             onClick={() => setLang('zh')}
             className={`flex-1 text-xs font-medium py-1.5 rounded ${lang === 'zh' ? 'bg-nexus-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
           >
             中文
           </button>
           <button 
             onClick={() => setLang('en')}
             className={`flex-1 text-xs font-medium py-1.5 rounded ${lang === 'en' ? 'bg-nexus-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
           >
             EN
           </button>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
          <Settings size={18} />
          <span className="text-sm font-medium">{t.config}</span>
        </button>
        <div className="mt-4 px-4">
          <div className="text-xs text-gray-500 font-mono">
            {t.version}<br/>
            {t.env}
          </div>
        </div>
      </div>
    </div>
  );
};
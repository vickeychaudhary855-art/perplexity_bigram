import { Brain, BarChart3, Database } from 'lucide-react';

interface HeaderProps {
  activeTab: 'keyboard' | 'dashboard';
  onTabChange: (tab: 'keyboard' | 'dashboard') => void;
  onToggleTraining: () => void;
  modelReady: boolean;
}

export function Header({ activeTab, onTabChange, onToggleTraining, modelReady }: HeaderProps) {
  return (
    <header className="bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg shadow-accent/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-dark-50 leading-tight">
              Bigram<span className="text-accent">AI</span>
            </h1>
            <p className="text-[10px] text-dark-500 font-medium tracking-wider uppercase">
              Perplexity-Inspired Keyboard
            </p>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTraining}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-dark-400 hover:text-accent hover:bg-dark-800 transition-all"
          >
            <Database className="w-3.5 h-3.5" />
            Train
          </button>
          
          <div className="flex bg-dark-800 rounded-xl p-0.5">
            <button
              onClick={() => onTabChange('keyboard')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'keyboard'
                  ? 'bg-dark-700 text-accent shadow-sm'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              ⌨️ Keyboard
            </button>
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-dark-700 text-accent shadow-sm'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Dashboard
            </button>
          </div>

          {/* Model Status */}
          <div className={`ml-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium ${
            modelReady
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${modelReady ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`} />
            {modelReady ? 'Model Ready' : 'Training...'}
          </div>
        </div>
      </div>
    </header>
  );
}

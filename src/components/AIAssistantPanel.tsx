import { useState } from 'react';
import { processAssistantAction, ASSISTANT_ACTIONS, AssistantAction } from '../engine/AIAssistant';
import { X, Sparkles, Copy, Check } from 'lucide-react';

interface AIAssistantPanelProps {
  text: string;
  onApply: (result: string) => void;
  onClose: () => void;
}

export function AIAssistantPanel({ text, onApply, onClose }: AIAssistantPanelProps) {
  const [result, setResult] = useState<string>('');
  const [activeAction, setActiveAction] = useState<AssistantAction | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAction = (action: AssistantAction) => {
    if (!text.trim()) return;
    setActiveAction(action);
    const processed = processAssistantAction(text, action);
    setResult(processed);
    setCopied(false);
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
      setResult('');
      setActiveAction(null);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-dark-900 border border-dark-700/50 rounded-2xl p-4 mb-3 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-dark-100">AI Writing Assistant</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
            AI-Powered
          </span>
        </div>
        <button onClick={onClose} className="text-dark-500 hover:text-dark-300 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {(Object.entries(ASSISTANT_ACTIONS) as [AssistantAction, typeof ASSISTANT_ACTIONS[AssistantAction]][]).map(
          ([key, meta]) => (
            <button
              key={key}
              onClick={() => handleAction(key)}
              disabled={!text.trim()}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium transition-all
                ${activeAction === key
                  ? 'bg-accent/20 text-accent border border-accent/40'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-dark-100 border border-dark-700/40'
                }
                disabled:opacity-30 disabled:cursor-not-allowed
              `}
            >
              <span className="text-base">{meta.icon}</span>
              <span>{meta.label}</span>
            </button>
          )
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-2 slide-up">
          <div className="bg-dark-800 rounded-xl p-3 border border-dark-700/30">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                AI Suggestion
              </span>
            </div>
            <p className="text-sm text-dark-200 leading-relaxed whitespace-pre-wrap">
              {result}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium
                         bg-accent text-dark-950 hover:bg-accent-light transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              Apply to Text
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium
                         bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-dark-100 transition-all
                         border border-dark-700/40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {!text.trim() && (
        <p className="text-center text-dark-600 text-xs py-2">
          Type some text first, then choose an action above.
        </p>
      )}
    </div>
  );
}

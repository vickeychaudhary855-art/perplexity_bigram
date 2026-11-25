import { Prediction } from '../engine/BigramModel';

interface SuggestionBarProps {
  predictions: Prediction[];
  onSuggestionTap: (word: string) => void;
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  trigram: { label: 'Context', color: 'text-purple-400' },
  bigram: { label: 'Bigram', color: 'text-accent' },
  unigram: { label: 'Common', color: 'text-dark-400' },
  ai: { label: 'AI', color: 'text-blue-400' },
};

export function SuggestionBar({ predictions, onSuggestionTap }: SuggestionBarProps) {
  if (predictions.length === 0) {
    return (
      <div className="flex items-center justify-center h-12 bg-dark-900/60 border border-dark-700/30 rounded-xl mb-2">
        <span className="text-dark-600 text-sm">Type something to see predictions…</span>
      </div>
    );
  }

  return (
    <div className="flex items-stretch gap-2 h-12 mb-2 slide-up">
      {predictions.map((pred, i) => {
        const src = SOURCE_LABELS[pred.source] || SOURCE_LABELS.bigram;
        return (
          <button
            key={`${pred.word}-${i}`}
            onClick={() => onSuggestionTap(pred.word)}
            className="flex-1 flex flex-col items-center justify-center bg-dark-800 hover:bg-dark-700 
                       border border-dark-700/50 hover:border-accent/40 rounded-xl transition-all
                       duration-150 active:scale-95 group cursor-pointer"
          >
            <span className="text-sm font-semibold text-dark-100 group-hover:text-accent transition-colors">
              {pred.word}
            </span>
            <span className={`text-[9px] font-medium ${src.color} opacity-70`}>
              {src.label} · {(pred.probability * 100).toFixed(1)}%
            </span>
          </button>
        );
      })}
    </div>
  );
}

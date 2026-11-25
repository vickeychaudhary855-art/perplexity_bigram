import { useState } from 'react';
import { X, Upload, RotateCcw } from 'lucide-react';
import { bigramModel } from '../engine/BigramModel';
import { DEFAULT_CORPUS } from '../engine/corpus';

interface TrainingPanelProps {
  onTrain: (corpus: string) => void;
  onClose: () => void;
}

export function TrainingPanel({ onTrain, onClose }: TrainingPanelProps) {
  const [customCorpus, setCustomCorpus] = useState('');
  const [status, setStatus] = useState<'idle' | 'training' | 'done'>('idle');

  const handleTrain = () => {
    if (!customCorpus.trim()) return;
    setStatus('training');
    // Use setTimeout so the UI can update
    setTimeout(() => {
      onTrain(customCorpus);
      setStatus('done');
      setTimeout(() => setStatus('idle'), 2000);
    }, 100);
  };

  const handleReset = () => {
    bigramModel.reset();
    bigramModel.train(DEFAULT_CORPUS);
    setCustomCorpus('');
    setStatus('done');
    setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <div className="bg-dark-900 border border-dark-700/50 rounded-2xl p-4 mt-4 fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-dark-100 flex items-center gap-2">
          <Upload className="w-4 h-4 text-accent" />
          Train Custom Corpus
        </h3>
        <button onClick={onClose} className="text-dark-500 hover:text-dark-300 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <textarea
        value={customCorpus}
        onChange={(e) => setCustomCorpus(e.target.value)}
        placeholder="Paste your custom training text here. The model will learn word patterns from this text in addition to the default corpus..."
        className="w-full h-32 bg-dark-800 border border-dark-700/50 rounded-xl px-4 py-3 text-sm
                   text-dark-200 placeholder:text-dark-600 resize-none focus:outline-none
                   focus:ring-2 focus:ring-accent/30 focus:border-accent/50 mb-3"
      />

      <div className="flex gap-2">
        <button
          onClick={handleTrain}
          disabled={!customCorpus.trim() || status === 'training'}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-medium
                     bg-accent text-dark-950 hover:bg-accent-light transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {status === 'training' ? (
            <>
              <div className="w-3 h-3 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin" />
              Training...
            </>
          ) : status === 'done' ? (
            '✓ Trained!'
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              Train Model
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-medium
                     bg-dark-800 text-dark-300 hover:bg-dark-700 border border-dark-700/40 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}

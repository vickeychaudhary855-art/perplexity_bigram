import { useEffect, useState } from 'react';
import { bigramModel, BigramStats, Prediction } from '../engine/BigramModel';
import { BookOpen, Hash, Layers, TrendingUp, BarChart3, Search } from 'lucide-react';

interface DashboardProps {
  text: string;
  predictions: Prediction[];
}

export function Dashboard({ text, predictions }: DashboardProps) {
  const [stats, setStats] = useState<BigramStats | null>(null);
  const [testInput, setTestInput] = useState('');
  const [testPredictions, setTestPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    if (bigramModel.isTrained) {
      setStats(bigramModel.getStats());
    }
  }, []);

  const handleTest = () => {
    if (testInput.trim()) {
      const preds = bigramModel.predict(testInput, 5);
      setTestPredictions(preds);
    }
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64 text-dark-500">
        Model not trained yet.
      </div>
    );
  }

  const statCards = [
    { label: 'Total Words', value: stats.totalWords.toLocaleString(), icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Vocabulary Size', value: stats.vocabularySize.toLocaleString(), icon: Hash, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Bigrams Learned', value: stats.totalBigrams.toLocaleString(), icon: Layers, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
    { label: 'Trigrams Learned', value: stats.totalTrigrams.toLocaleString(), icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  ];

  return (
    <div className="space-y-6 mt-6 fade-in">
      <h2 className="text-xl font-bold text-dark-100 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-accent" />
        Model Dashboard
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-4`}>
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <div className="text-2xl font-bold text-dark-100">{value}</div>
            <div className="text-xs text-dark-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Live Test */}
      <div className="bg-dark-900 border border-dark-700/50 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-dark-100 flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-accent" />
          Live Prediction Tester
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTest()}
            placeholder='Try "I am" or "how are"...'
            className="flex-1 bg-dark-800 border border-dark-700/50 rounded-xl px-4 py-2.5 text-sm
                       text-dark-100 placeholder:text-dark-600 focus:outline-none focus:ring-2
                       focus:ring-accent/30 focus:border-accent/50"
          />
          <button
            onClick={handleTest}
            className="px-5 py-2.5 bg-accent text-dark-950 rounded-xl text-sm font-medium
                       hover:bg-accent-light transition-all"
          >
            Predict
          </button>
        </div>
        
        {testPredictions.length > 0 && (
          <div className="space-y-2 slide-up">
            <div className="text-xs text-dark-400 mb-2">
              Predictions for: <span className="text-accent font-mono">"{testInput}"</span>
            </div>
            {testPredictions.map((pred, i) => (
              <div key={i} className="flex items-center gap-3 bg-dark-800 rounded-xl px-4 py-3 border border-dark-700/30">
                <span className="text-xs font-bold text-dark-500 w-5">#{i + 1}</span>
                <span className="text-sm font-semibold text-dark-100 flex-1">{pred.word}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  pred.source === 'trigram'
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    : pred.source === 'bigram'
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'bg-dark-700 text-dark-400 border border-dark-600/30'
                }`}>
                  {pred.source}
                </span>
                <div className="w-24">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${Math.min(pred.probability * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-dark-400 font-mono w-12 text-right">
                      {(pred.probability * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Words & Bigrams */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Top Words */}
        <div className="bg-dark-900 border border-dark-700/50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-dark-100 mb-4">Most Frequent Words</h3>
          <div className="space-y-2">
            {stats.topWords.map(({ word, count }, i) => {
              const maxCount = stats.topWords[0]?.count || 1;
              return (
                <div key={word} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-dark-600 w-5">#{i + 1}</span>
                  <span className="text-sm text-dark-200 flex-1 font-mono">{word}</span>
                  <div className="w-24 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400/60 rounded-full"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-dark-500 font-mono w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Bigrams */}
        <div className="bg-dark-900 border border-dark-700/50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-dark-100 mb-4">Most Frequent Bigrams</h3>
          <div className="space-y-2">
            {stats.topBigrams.map(({ bigram, count }, i) => {
              const maxCount = stats.topBigrams[0]?.count || 1;
              return (
                <div key={bigram} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-dark-600 w-5">#{i + 1}</span>
                  <span className="text-sm text-dark-200 flex-1 font-mono">{bigram}</span>
                  <div className="w-24 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent/60 rounded-full"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-dark-500 font-mono w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Predictions */}
      {predictions.length > 0 && (
        <div className="bg-dark-900 border border-dark-700/50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-dark-100 mb-3">
            Current Live Predictions
            <span className="ml-2 text-dark-500 font-normal">
              (from keyboard input: "{text.trim().split(/\s+/).slice(-2).join(' ')}")
            </span>
          </h3>
          <div className="flex gap-3">
            {predictions.map((pred, i) => (
              <div key={i} className="flex-1 bg-dark-800 rounded-xl p-3 border border-dark-700/30 text-center">
                <div className="text-lg font-bold text-dark-100">{pred.word}</div>
                <div className="text-xs text-dark-400 mt-1">
                  {pred.source} · {(pred.probability * 100).toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

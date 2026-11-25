import { useState, useEffect, useCallback, useRef } from 'react';
import { Keyboard } from './components/Keyboard';
import { TextEditor } from './components/TextEditor';
import { SuggestionBar } from './components/SuggestionBar';
import { AIAssistantPanel } from './components/AIAssistantPanel';
import { Dashboard } from './components/Dashboard';
import { TrainingPanel } from './components/TrainingPanel';
import { Header } from './components/Header';
import { bigramModel, Prediction } from './engine/BigramModel';
import { DEFAULT_CORPUS } from './engine/corpus';

type Tab = 'keyboard' | 'dashboard';

export default function App() {
  const [text, setText] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('keyboard');
  const [showAI, setShowAI] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState<'alpha' | 'num' | 'emoji'>('alpha');
  const textRef = useRef<HTMLTextAreaElement>(null);
  const cursorPosRef = useRef<number>(0);

  // Train model on mount
  useEffect(() => {
    bigramModel.train(DEFAULT_CORPUS);
    setModelReady(true);
  }, []);

  // Update predictions when text changes
  useEffect(() => {
    if (!modelReady) return;
    
    const trimmed = text.trimEnd();
    if (trimmed.length === 0) {
      setPredictions([]);
      return;
    }

    // Get the text up to the cursor to predict from context
    const preds = bigramModel.predict(trimmed, 3);
    setPredictions(preds);
  }, [text, modelReady]);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'BACKSPACE') {
      setText(prev => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      setText(prev => prev + '\n');
    } else if (key === 'SPACE') {
      setText(prev => prev + ' ');
    } else if (key === 'CAPS') {
      setCapsLock(prev => !prev);
    } else if (key === 'NUM') {
      setKeyboardMode(prev => prev === 'num' ? 'alpha' : 'num');
    } else if (key === 'EMOJI') {
      setKeyboardMode(prev => prev === 'emoji' ? 'alpha' : 'emoji');
    } else {
      const char = capsLock ? key.toUpperCase() : key.toLowerCase();
      setText(prev => prev + char);
    }
  }, [capsLock]);

  const handleSuggestionTap = useCallback((word: string) => {
    setText(prev => {
      const trimmed = prev.trimEnd();
      // If text ends with space or is empty, just append
      if (prev.endsWith(' ') || prev === '') {
        return prev + word + ' ';
      }
      // Otherwise add space then word
      return trimmed + ' ' + word + ' ';
    });
  }, []);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const handleTrainCustom = useCallback((corpus: string) => {
    bigramModel.reset();
    bigramModel.train(DEFAULT_CORPUS);
    bigramModel.train(corpus);
    setModelReady(true);
    // Refresh predictions
    const preds = bigramModel.predict(text, 3);
    setPredictions(preds);
  }, [text]);

  const handleAIResult = useCallback((result: string) => {
    setText(result);
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggleTraining={() => setShowTraining(p => !p)}
        modelReady={modelReady}
      />

      {activeTab === 'keyboard' ? (
        <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 pb-4">
          {/* Training Panel (collapsible) */}
          {showTraining && (
            <TrainingPanel
              onTrain={handleTrainCustom}
              onClose={() => setShowTraining(false)}
            />
          )}

          {/* Text Editor Area */}
          <div className="flex-1 mt-4 mb-3">
            <TextEditor
              text={text}
              onChange={handleTextChange}
              ref={textRef}
            />
          </div>

          {/* AI Assistant Toggle */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowAI(p => !p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                showAI
                  ? 'bg-accent text-dark-950'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-dark-100'
              }`}
            >
              <span className="text-base">🤖</span>
              AI Assistant
            </button>
          </div>

          {/* AI Assistant Panel */}
          {showAI && (
            <AIAssistantPanel
              text={text}
              onApply={handleAIResult}
              onClose={() => setShowAI(false)}
            />
          )}

          {/* Suggestion Bar */}
          <SuggestionBar
            predictions={predictions}
            onSuggestionTap={handleSuggestionTap}
          />

          {/* Keyboard */}
          <Keyboard
            onKeyPress={handleKeyPress}
            capsLock={capsLock}
            mode={keyboardMode}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 pb-8">
          <Dashboard text={text} predictions={predictions} />
        </main>
      )}
    </div>
  );
}

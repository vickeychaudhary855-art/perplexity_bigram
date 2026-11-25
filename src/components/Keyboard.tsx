import { useState, useCallback, useRef } from 'react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  capsLock: boolean;
  mode: 'alpha' | 'num' | 'emoji';
}

const ALPHA_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const NUM_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['@', '#', '$', '%', '&', '-', '+', '(', ')'],
  ['*', '"', "'", ':', ';', '!', '?', ',', '.'],
];

const EMOJI_ROWS = [
  ['😀', '😂', '😍', '🥰', '😎', '🤔', '😱', '🥳', '😴', '🤗'],
  ['👍', '👎', '❤️', '🔥', '⭐', '🎉', '💯', '🙏', '👏'],
  ['🚀', '💡', '📝', '✅', '❌', '⚡', '🎯'],
];

export function Keyboard({ onKeyPress, capsLock, mode }: KeyboardProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handlePress = useCallback((key: string) => {
    setPressedKey(key);
    onKeyPress(key);
    setTimeout(() => setPressedKey(null), 100);
  }, [onKeyPress]);

  const rows = mode === 'alpha' ? ALPHA_ROWS : mode === 'num' ? NUM_ROWS : EMOJI_ROWS;

  const renderKey = (key: string, isSpecial = false, label?: string, width?: string, extraClass?: string) => {
    const display = mode === 'alpha' && capsLock && !isSpecial ? key.toUpperCase() : key;
    const isPressed = pressedKey === key;
    
    return (
      <button
        key={key + label}
        onPointerDown={() => handlePress(key)}
        className={`
          flex items-center justify-center rounded-xl font-medium select-none
          transition-all duration-75 active:scale-[0.92]
          ${width || 'w-[9%] min-w-[32px]'}
          h-12
          ${isPressed ? 'key-press' : ''}
          ${isSpecial
            ? 'bg-dark-700 text-dark-300 hover:bg-dark-600 text-xs'
            : 'bg-dark-800 text-dark-100 hover:bg-dark-700 text-sm'
          }
          ${extraClass || ''}
          shadow-sm shadow-black/20 border border-dark-700/40
        `}
      >
        {label || display}
      </button>
    );
  };

  return (
    <div className="bg-dark-900/80 backdrop-blur-xl border border-dark-700/40 rounded-2xl p-2 space-y-1.5">
      {/* Row 1 */}
      <div className="flex justify-center gap-1">
        {rows[0].map(k => renderKey(k))}
      </div>

      {/* Row 2 */}
      <div className="flex justify-center gap-1">
        {rows[1].map(k => renderKey(k))}
      </div>

      {/* Row 3 */}
      <div className="flex justify-center gap-1">
        {mode === 'alpha' && renderKey('CAPS', true, capsLock ? '⬆' : '⇧', 'w-[12%] min-w-[42px]', capsLock ? 'bg-accent/20 text-accent border-accent/40' : '')}
        {rows[2].map(k => renderKey(k))}
        {renderKey('BACKSPACE', true, '⌫', 'w-[12%] min-w-[42px]')}
      </div>

      {/* Row 4 — bottom row */}
      <div className="flex justify-center gap-1">
        {renderKey('NUM', true, mode === 'num' ? 'ABC' : '123', 'w-[12%] min-w-[42px]')}
        {renderKey('EMOJI', true, '😊', 'w-[10%] min-w-[36px]', mode === 'emoji' ? 'bg-accent/20 border-accent/40' : '')}
        {renderKey('SPACE', true, 'space', 'flex-1')}
        {renderKey('.', false, '.', 'w-[8%] min-w-[32px]')}
        {renderKey('ENTER', true, '↵', 'w-[12%] min-w-[42px]', 'bg-accent text-dark-950 hover:bg-accent-light border-accent')}
      </div>
    </div>
  );
}

import { forwardRef } from 'react';

interface TextEditorProps {
  text: string;
  onChange: (text: string) => void;
}

export const TextEditor = forwardRef<HTMLTextAreaElement, TextEditorProps>(
  ({ text, onChange }, ref) => {
    return (
      <div className="relative h-full">
        <div className="absolute top-3 left-4 text-dark-500 text-xs font-medium tracking-wide uppercase">
          Text Input
        </div>
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start typing to see predictions..."
          className="w-full h-full min-h-[180px] bg-dark-900 border border-dark-700/50 rounded-2xl 
                     px-4 pt-10 pb-4 text-dark-100 text-base leading-relaxed resize-none
                     placeholder:text-dark-600 focus:outline-none focus:ring-2 focus:ring-accent/30 
                     focus:border-accent/50 transition-all font-sans"
          spellCheck={false}
          autoComplete="off"
        />
        <div className="absolute bottom-3 right-4 text-dark-600 text-xs">
          {text.length} chars · {text.split(/\s+/).filter(w => w.length > 0).length} words
        </div>
      </div>
    );
  }
);

TextEditor.displayName = 'TextEditor';

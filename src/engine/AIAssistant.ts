/**
 * AI Writing Assistant
 * Provides text transformation capabilities using rule-based NLP techniques.
 * Works entirely client-side — no API needed.
 */

export type AssistantAction =
  | 'rewrite'
  | 'fix_grammar'
  | 'professional'
  | 'casual'
  | 'shorten'
  | 'expand'
  | 'continue'
  | 'alternatives';

interface ActionMeta {
  label: string;
  icon: string;
  description: string;
}

export const ASSISTANT_ACTIONS: Record<AssistantAction, ActionMeta> = {
  rewrite: { label: 'Rewrite', icon: '✏️', description: 'Rephrase the text differently' },
  fix_grammar: { label: 'Fix Grammar', icon: '🔤', description: 'Correct grammar and punctuation' },
  professional: { label: 'Professional', icon: '💼', description: 'Make text more formal' },
  casual: { label: 'Casual', icon: '😊', description: 'Make text more casual' },
  shorten: { label: 'Shorten', icon: '✂️', description: 'Make text more concise' },
  expand: { label: 'Expand', icon: '📝', description: 'Add more detail' },
  continue: { label: 'Continue', icon: '➡️', description: 'Continue writing' },
  alternatives: { label: 'Alternatives', icon: '🔄', description: 'Generate alternative sentences' },
};

// Synonym mappings for rewriting
const SYNONYMS: Record<string, string[]> = {
  good: ['excellent', 'great', 'wonderful', 'fine', 'superb'],
  bad: ['poor', 'terrible', 'awful', 'dreadful', 'subpar'],
  big: ['large', 'enormous', 'huge', 'substantial', 'massive'],
  small: ['tiny', 'little', 'compact', 'miniature', 'modest'],
  happy: ['joyful', 'pleased', 'delighted', 'glad', 'content'],
  sad: ['unhappy', 'sorrowful', 'disappointed', 'melancholy', 'downcast'],
  fast: ['quick', 'rapid', 'swift', 'speedy', 'prompt'],
  slow: ['gradual', 'leisurely', 'unhurried', 'steady', 'deliberate'],
  important: ['crucial', 'vital', 'essential', 'significant', 'critical'],
  beautiful: ['stunning', 'gorgeous', 'lovely', 'elegant', 'exquisite'],
  help: ['assist', 'support', 'aid', 'facilitate', 'guide'],
  make: ['create', 'build', 'develop', 'produce', 'construct'],
  use: ['utilize', 'employ', 'apply', 'leverage', 'harness'],
  get: ['obtain', 'acquire', 'receive', 'gain', 'secure'],
  show: ['demonstrate', 'display', 'illustrate', 'reveal', 'present'],
  think: ['believe', 'consider', 'reckon', 'suppose', 'contemplate'],
  like: ['enjoy', 'appreciate', 'prefer', 'fancy', 'favor'],
  need: ['require', 'demand', 'necessitate', 'call for', 'depend on'],
  want: ['desire', 'wish', 'aspire', 'seek', 'long for'],
  say: ['state', 'mention', 'express', 'declare', 'remark'],
  very: ['extremely', 'highly', 'remarkably', 'exceptionally', 'particularly'],
  really: ['truly', 'genuinely', 'certainly', 'indeed', 'absolutely'],
};

// Professional replacements
const CASUAL_TO_PROFESSIONAL: Record<string, string> = {
  "gonna": "going to",
  "wanna": "want to",
  "gotta": "have to",
  "kinda": "somewhat",
  "sorta": "sort of",
  "y'all": "everyone",
  "yeah": "yes",
  "nope": "no",
  "cool": "excellent",
  "awesome": "outstanding",
  "stuff": "materials",
  "thing": "matter",
  "things": "matters",
  "lots of": "numerous",
  "a lot": "significantly",
  "pretty": "quite",
  "ok": "acceptable",
  "okay": "acceptable",
  "hey": "hello",
  "hi": "hello",
  "guys": "everyone",
  "kids": "children",
  "big": "significant",
  "huge": "substantial",
  "fix": "resolve",
  "asap": "at the earliest convenience",
  "fyi": "for your information",
  "btw": "additionally",
};

// Professional to casual
const PROFESSIONAL_TO_CASUAL: Record<string, string> = {
  "furthermore": "also",
  "however": "but",
  "therefore": "so",
  "consequently": "so",
  "nevertheless": "still",
  "additionally": "also",
  "subsequently": "then",
  "utilize": "use",
  "facilitate": "help",
  "implement": "do",
  "commence": "start",
  "terminate": "end",
  "inquire": "ask",
  "regarding": "about",
  "pertaining to": "about",
  "in accordance with": "following",
  "at this point in time": "now",
  "in the event that": "if",
  "prior to": "before",
  "subsequent to": "after",
  "sufficient": "enough",
  "demonstrate": "show",
  "endeavor": "try",
  "ascertain": "find out",
  "numerous": "many",
  "substantial": "big",
  "currently": "now",
};

// Filler words to remove when shortening
const FILLER_WORDS = new Set([
  'very', 'really', 'actually', 'basically', 'literally', 'just',
  'quite', 'rather', 'somewhat', 'simply', 'merely', 'certainly',
  'obviously', 'clearly', 'definitely', 'absolutely', 'totally',
  'completely', 'entirely', 'practically', 'essentially', 'virtually',
]);

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function processAssistantAction(text: string, action: AssistantAction): string {
  if (!text.trim()) return text;

  switch (action) {
    case 'rewrite':
      return rewriteText(text);
    case 'fix_grammar':
      return fixGrammar(text);
    case 'professional':
      return makeProfessional(text);
    case 'casual':
      return makeCasual(text);
    case 'shorten':
      return shortenText(text);
    case 'expand':
      return expandText(text);
    case 'continue':
      return continueText(text);
    case 'alternatives':
      return generateAlternatives(text);
    default:
      return text;
  }
}

function rewriteText(text: string): string {
  const words = text.split(/\s+/);
  const result = words.map(word => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    const punct = word.replace(/[a-zA-Z]/g, '');
    if (SYNONYMS[clean]) {
      const syn = randomPick(SYNONYMS[clean]);
      const replaced = word[0] === word[0].toUpperCase() ? capitalize(syn) : syn;
      return replaced + punct.slice(clean.length < word.length ? word.length - clean.length : 0);
    }
    return word;
  });
  return result.join(' ');
}

function fixGrammar(text: string): string {
  let result = text;
  
  // Capitalize first letter of sentences
  result = result.replace(/(^|[.!?]\s+)([a-z])/g, (_, pre, letter) => pre + letter.toUpperCase());
  
  // Fix double spaces
  result = result.replace(/\s{2,}/g, ' ');
  
  // Fix missing space after punctuation
  result = result.replace(/([.!?,;:])([A-Za-z])/g, '$1 $2');
  
  // Fix "i" to "I"
  result = result.replace(/\bi\b/g, 'I');
  
  // Fix common contractions
  result = result.replace(/\bdont\b/gi, "don't");
  result = result.replace(/\bcant\b/gi, "can't");
  result = result.replace(/\bwont\b/gi, "won't");
  result = result.replace(/\bdidnt\b/gi, "didn't");
  result = result.replace(/\bisnt\b/gi, "isn't");
  result = result.replace(/\barent\b/gi, "aren't");
  result = result.replace(/\bwasnt\b/gi, "wasn't");
  result = result.replace(/\bwerent\b/gi, "weren't");
  result = result.replace(/\bhasnt\b/gi, "hasn't");
  result = result.replace(/\bhavent\b/gi, "haven't");
  result = result.replace(/\bwouldnt\b/gi, "wouldn't");
  result = result.replace(/\bcouldnt\b/gi, "couldn't");
  result = result.replace(/\bshouldnt\b/gi, "shouldn't");
  result = result.replace(/\bthats\b/gi, "that's");
  result = result.replace(/\bits\b(?!\s+(a|an|the|my|your|his|her|our|their|not))/gi, "it's");
  result = result.replace(/\bim\b/gi, "I'm");
  result = result.replace(/\byoure\b/gi, "you're");
  result = result.replace(/\btheyre\b/gi, "they're");
  result = result.replace(/\bwere\b(?=\s+(going|doing|working|looking|trying))/gi, "we're");
  
  // Add period if sentence doesn't end with punctuation
  result = result.trim();
  if (result.length > 0 && !/[.!?]$/.test(result)) {
    result += '.';
  }
  
  return result;
}

function makeProfessional(text: string): string {
  let result = text;
  
  // Replace casual words
  for (const [casual, professional] of Object.entries(CASUAL_TO_PROFESSIONAL)) {
    const regex = new RegExp(`\\b${casual}\\b`, 'gi');
    result = result.replace(regex, professional);
  }
  
  // Fix grammar too
  result = fixGrammar(result);
  
  return result;
}

function makeCasual(text: string): string {
  let result = text;
  
  // Replace professional words
  for (const [professional, casual] of Object.entries(PROFESSIONAL_TO_CASUAL)) {
    const regex = new RegExp(`\\b${professional}\\b`, 'gi');
    result = result.replace(regex, casual);
  }
  
  // Remove trailing period for a casual feel
  result = result.trim();
  if (result.endsWith('.') && !result.endsWith('...')) {
    result = result.slice(0, -1);
  }
  
  return result;
}

function shortenText(text: string): string {
  const words = text.split(/\s+/);
  const filtered = words.filter(w => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    return !FILLER_WORDS.has(clean);
  });
  
  let result = filtered.join(' ');
  
  // Remove redundant phrases
  result = result.replace(/\bin order to\b/gi, 'to');
  result = result.replace(/\bdue to the fact that\b/gi, 'because');
  result = result.replace(/\bat this point in time\b/gi, 'now');
  result = result.replace(/\bin the event that\b/gi, 'if');
  result = result.replace(/\bfor the purpose of\b/gi, 'to');
  result = result.replace(/\bwith regard to\b/gi, 'about');
  result = result.replace(/\bin spite of the fact that\b/gi, 'although');
  result = result.replace(/\bas a matter of fact\b/gi, '');
  result = result.replace(/\bit is important to note that\b/gi, '');
  result = result.replace(/\bit should be noted that\b/gi, '');
  
  // Clean up double spaces
  result = result.replace(/\s{2,}/g, ' ').trim();
  
  return result;
}

function expandText(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  const expansions = [
    'This is particularly noteworthy because it highlights the significance of the matter at hand.',
    'Furthermore, this demonstrates the importance of careful consideration in such contexts.',
    'It is worth mentioning that this carries broader implications for the overall situation.',
    'In addition, one should consider the various perspectives and factors involved.',
    'This underscores the need for a thoughtful and comprehensive approach.',
  ];
  
  if (sentences.length === 1) {
    return text + ' ' + randomPick(expansions);
  }
  
  // Insert an expansion after the first sentence
  const expanded = [sentences[0], randomPick(expansions), ...sentences.slice(1)];
  return expanded.join(' ');
}

function continueText(text: string): string {
  const continuations = [
    'Moreover, this opens up new possibilities for future development and growth.',
    'Building on this foundation, we can explore additional approaches and strategies.',
    'This naturally leads to the question of how we can best leverage these insights.',
    'As we move forward, it will be important to consider both the opportunities and challenges.',
    'The implications of this extend beyond the immediate context and warrant further exploration.',
    'Taking this into account, the next logical step would be to evaluate our options carefully.',
    'This sets the stage for meaningful progress in the days and weeks ahead.',
    'With this understanding, we are well positioned to take decisive action.',
  ];
  
  return text + ' ' + randomPick(continuations);
}

function generateAlternatives(text: string): string {
  const alt1 = rewriteText(text);
  const alt2 = rewriteText(text);
  const alt3 = rewriteText(text);
  
  return [
    `Alternative 1: ${alt1}`,
    `Alternative 2: ${alt2}`,
    `Alternative 3: ${alt3}`,
  ].join('\n');
}

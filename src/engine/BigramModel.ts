/**
 * Bigram Language Model
 * 
 * Implements a real bigram (and optional trigram) language model from scratch.
 * Uses Laplace smoothing, proper tokenization, and conditional probability
 * calculations: P(w2 | w1) = (Count(w1, w2) + alpha) / (Count(w1) + alpha * V)
 */

export interface BigramStats {
  totalWords: number;
  vocabularySize: number;
  totalBigrams: number;
  totalTrigrams: number;
  topWords: Array<{ word: string; count: number }>;
  topBigrams: Array<{ bigram: string; count: number }>;
}

export interface Prediction {
  word: string;
  probability: number;
  source: 'bigram' | 'trigram' | 'unigram' | 'ai';
}

export class BigramModel {
  // Word counts: word -> count
  private unigramCounts: Map<string, number> = new Map();
  // Bigram counts: "w1" -> { "w2": count }
  private bigramCounts: Map<string, Map<string, number>> = new Map();
  // Trigram counts: "w1 w2" -> { "w3": count }
  private trigramCounts: Map<string, Map<string, number>> = new Map();
  // Vocabulary set
  private vocabulary: Set<string> = new Set();
  // Total word count
  private totalWords: number = 0;
  // Laplace smoothing alpha
  private alpha: number = 1.0;
  // Whether model is trained
  private _isTrained: boolean = false;

  get isTrained(): boolean {
    return this._isTrained;
  }

  /**
   * Tokenize and preprocess text
   */
  tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ')  // keep apostrophes for contractions
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(w => w.length > 0);
  }

  /**
   * Train the model on a text corpus
   */
  train(text: string): void {
    const tokens = this.tokenize(text);
    if (tokens.length === 0) return;

    // Count unigrams
    for (const token of tokens) {
      this.vocabulary.add(token);
      this.unigramCounts.set(token, (this.unigramCounts.get(token) || 0) + 1);
      this.totalWords++;
    }

    // Count bigrams
    for (let i = 0; i < tokens.length - 1; i++) {
      const w1 = tokens[i];
      const w2 = tokens[i + 1];
      
      if (!this.bigramCounts.has(w1)) {
        this.bigramCounts.set(w1, new Map());
      }
      const nextWords = this.bigramCounts.get(w1)!;
      nextWords.set(w2, (nextWords.get(w2) || 0) + 1);
    }

    // Count trigrams
    for (let i = 0; i < tokens.length - 2; i++) {
      const key = `${tokens[i]} ${tokens[i + 1]}`;
      const w3 = tokens[i + 2];
      
      if (!this.trigramCounts.has(key)) {
        this.trigramCounts.set(key, new Map());
      }
      const nextWords = this.trigramCounts.get(key)!;
      nextWords.set(w3, (nextWords.get(w3) || 0) + 1);
    }

    this._isTrained = true;
  }

  /**
   * Reset the model
   */
  reset(): void {
    this.unigramCounts.clear();
    this.bigramCounts.clear();
    this.trigramCounts.clear();
    this.vocabulary.clear();
    this.totalWords = 0;
    this._isTrained = false;
  }

  /**
   * Calculate bigram probability with Laplace smoothing
   * P(w2 | w1) = (Count(w1, w2) + alpha) / (Count(w1) + alpha * V)
   */
  bigramProbability(w1: string, w2: string): number {
    const w1Lower = w1.toLowerCase();
    const w2Lower = w2.toLowerCase();
    const V = this.vocabulary.size;
    
    const w1Count = this.unigramCounts.get(w1Lower) || 0;
    const bigramCount = this.bigramCounts.get(w1Lower)?.get(w2Lower) || 0;
    
    return (bigramCount + this.alpha) / (w1Count + this.alpha * V);
  }

  /**
   * Calculate trigram probability with Laplace smoothing
   */
  trigramProbability(w1: string, w2: string, w3: string): number {
    const key = `${w1.toLowerCase()} ${w2.toLowerCase()}`;
    const w3Lower = w3.toLowerCase();
    const V = this.vocabulary.size;
    
    const contextCount = this.bigramCounts.get(w1.toLowerCase())?.get(w2.toLowerCase()) || 0;
    const trigramCount = this.trigramCounts.get(key)?.get(w3Lower) || 0;
    
    return (trigramCount + this.alpha) / (contextCount + this.alpha * V);
  }

  /**
   * Get top-N next-word predictions based on the last word (bigram)
   */
  predictNextBigram(previousWord: string, topN: number = 3): Prediction[] {
    const w1 = previousWord.toLowerCase();
    const nextWords = this.bigramCounts.get(w1);
    
    if (!nextWords || nextWords.size === 0) {
      // Fall back to most common unigrams
      return this.getMostCommonWords(topN).map(({ word, count }) => ({
        word,
        probability: count / this.totalWords,
        source: 'unigram' as const,
      }));
    }

    const predictions: Prediction[] = [];
    const V = this.vocabulary.size;
    const w1Count = this.unigramCounts.get(w1) || 0;

    for (const [w2, count] of nextWords) {
      const prob = (count + this.alpha) / (w1Count + this.alpha * V);
      predictions.push({ word: w2, probability: prob, source: 'bigram' });
    }

    predictions.sort((a, b) => b.probability - a.probability);
    return predictions.slice(0, topN);
  }

  /**
   * Get top-N predictions based on last two words (trigram)
   */
  predictNextTrigram(w1: string, w2: string, topN: number = 3): Prediction[] {
    const key = `${w1.toLowerCase()} ${w2.toLowerCase()}`;
    const nextWords = this.trigramCounts.get(key);

    if (!nextWords || nextWords.size === 0) {
      return [];
    }

    const predictions: Prediction[] = [];
    const V = this.vocabulary.size;
    const contextCount = this.bigramCounts.get(w1.toLowerCase())?.get(w2.toLowerCase()) || 0;

    for (const [w3, count] of nextWords) {
      const prob = (count + this.alpha) / (contextCount + this.alpha * V);
      predictions.push({ word: w3, probability: prob, source: 'trigram' });
    }

    predictions.sort((a, b) => b.probability - a.probability);
    return predictions.slice(0, topN);
  }

  /**
   * Hybrid prediction: try trigram first, then bigram, then unigram fallback
   */
  predict(inputText: string, topN: number = 3): Prediction[] {
    const tokens = this.tokenize(inputText);
    
    if (tokens.length === 0) {
      return this.getMostCommonWords(topN).map(({ word, count }) => ({
        word,
        probability: count / this.totalWords,
        source: 'unigram' as const,
      }));
    }

    // Level 2: Try trigram if we have 2+ words
    if (tokens.length >= 2) {
      const w1 = tokens[tokens.length - 2];
      const w2 = tokens[tokens.length - 1];
      const trigramPreds = this.predictNextTrigram(w1, w2, topN);
      
      if (trigramPreds.length > 0) {
        // If trigram has fewer than topN, supplement with bigram
        if (trigramPreds.length < topN) {
          const bigramPreds = this.predictNextBigram(w2, topN);
          const existing = new Set(trigramPreds.map(p => p.word));
          for (const bp of bigramPreds) {
            if (!existing.has(bp.word) && trigramPreds.length < topN) {
              trigramPreds.push(bp);
            }
          }
        }
        return trigramPreds.slice(0, topN);
      }
    }

    // Level 1: Bigram prediction
    const lastWord = tokens[tokens.length - 1];
    return this.predictNextBigram(lastWord, topN);
  }

  /**
   * Autocorrect: find closest word in vocabulary (edit distance)
   */
  autocorrect(word: string): string | null {
    const w = word.toLowerCase();
    if (this.vocabulary.has(w)) return null; // word is known

    let bestWord: string | null = null;
    let bestDistance = Infinity;

    for (const vocabWord of this.vocabulary) {
      const dist = this.editDistance(w, vocabWord);
      if (dist < bestDistance && dist <= 2) {
        bestDistance = dist;
        bestWord = vocabWord;
      }
    }

    return bestWord;
  }

  /**
   * Levenshtein edit distance
   */
  private editDistance(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }

    return dp[m][n];
  }

  /**
   * Get the most common words
   */
  getMostCommonWords(topN: number = 10): Array<{ word: string; count: number }> {
    const entries = Array.from(this.unigramCounts.entries())
      .filter(([w]) => w.length > 1) // skip single chars
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);
    return entries.slice(0, topN);
  }

  /**
   * Get model statistics
   */
  getStats(): BigramStats {
    let totalBigrams = 0;
    for (const nextWords of this.bigramCounts.values()) {
      totalBigrams += nextWords.size;
    }

    let totalTrigrams = 0;
    for (const nextWords of this.trigramCounts.values()) {
      totalTrigrams += nextWords.size;
    }

    return {
      totalWords: this.totalWords,
      vocabularySize: this.vocabulary.size,
      totalBigrams,
      totalTrigrams,
      topWords: this.getMostCommonWords(10),
      topBigrams: this.getTopBigrams(10),
    };
  }

  /**
   * Get top bigrams by frequency
   */
  private getTopBigrams(topN: number): Array<{ bigram: string; count: number }> {
    const bigrams: Array<{ bigram: string; count: number }> = [];
    
    for (const [w1, nextWords] of this.bigramCounts) {
      for (const [w2, count] of nextWords) {
        bigrams.push({ bigram: `${w1} ${w2}`, count });
      }
    }

    bigrams.sort((a, b) => b.count - a.count);
    return bigrams.slice(0, topN);
  }

  /**
   * Check if a word is in vocabulary
   */
  isKnownWord(word: string): boolean {
    return this.vocabulary.has(word.toLowerCase());
  }

  /**
   * Set smoothing parameter
   */
  setAlpha(alpha: number): void {
    this.alpha = alpha;
  }

  /**
   * Get vocabulary
   */
  getVocabulary(): string[] {
    return Array.from(this.vocabulary).sort();
  }
}

// Singleton instance
export const bigramModel = new BigramModel();

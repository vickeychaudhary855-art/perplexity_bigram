# Perplexity AI Bigram Keyboard 🧠⌨️

A modern, intelligent AI-powered keyboard application inspired by **Google Gboard** and **Perplexity AI** — built with React, TypeScript, and Tailwind CSS.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

## ✨ Features

### 🧠 Bigram Language Model (Core)
- **Real bigram + trigram model** trained from scratch — no hardcoded predictions
- Tokenization, vocabulary creation, word frequency counting
- Laplace-smoothed conditional probabilities:
  ```
  P(w2 | w1) = (Count(w1, w2) + α) / (Count(w1) + α × V)
  ```
- **3-level hybrid prediction engine**: trigram → bigram → unigram fallback
- Autocorrect via Levenshtein edit distance
- Train on custom text corpus

### ⌨️ Gboard-Inspired Keyboard
- Full QWERTY layout with caps lock
- Number & symbol keyboard mode
- Emoji keyboard mode
- Suggestion bar showing top-3 next-word predictions with source labels & probabilities
- Smooth key-press animations

### 🤖 AI Writing Assistant
- **Rewrite** — rephrase text with synonyms
- **Fix Grammar** — correct punctuation, capitalization, contractions
- **Professional** — formalize casual language
- **Casual** — simplify formal language
- **Shorten** — remove filler words and redundant phrases
- **Expand** — add context and detail
- **Continue** — generate a continuation
- **Alternatives** — produce 3 alternate phrasings

### 📊 Model Dashboard
- Total words, vocabulary size, bigrams & trigrams learned
- Most frequent words & bigrams with bar charts
- **Live Prediction Tester** — type any phrase and see ranked predictions with probabilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/perplexity_bigram.git
cd perplexity_bigram

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 🗂️ Project Structure

```
src/
├── engine/
│   ├── BigramModel.ts     # Core bigram/trigram language model
│   ├── AIAssistant.ts     # Rule-based AI writing assistant
│   └── corpus.ts          # Default training corpus
├── components/
│   ├── Keyboard.tsx       # Gboard-inspired keyboard UI
│   ├── SuggestionBar.tsx  # Next-word prediction bar
│   ├── TextEditor.tsx     # Text input area
│   ├── AIAssistantPanel.tsx  # AI assistant panel
│   ├── Dashboard.tsx      # Model statistics dashboard
│   ├── TrainingPanel.tsx  # Custom corpus training panel
│   └── Header.tsx         # App header & navigation
├── App.tsx                # Root component & state management
├── main.tsx               # React entry point
└── index.css              # Tailwind + custom animations
```

## 🧪 Testing the Model

Navigate to the **Dashboard** tab and use the **Live Prediction Tester**:

| Input | Example Predictions |
|-------|-------------------|
| `I am` | `happy`, `learning`, `going` |
| `how are` | `you`, `things`, `we` |
| `machine learning` | `models`, `is`, `pipeline` |
| `the weather` | `is`, `has`, `was` |

## 📐 How the Bigram Model Works

1. **Tokenize** — lowercase, strip punctuation, split into words
2. **Count** — record unigram, bigram, and trigram frequencies
3. **Smooth** — apply Laplace (add-α) smoothing to handle unseen pairs
4. **Predict** — rank candidates by conditional probability
5. **Fallback** — if trigram fails → bigram → most common unigrams

## 🎨 Design

- Dark theme inspired by Perplexity AI
- Teal accent color (`#20b2aa`)
- Inter & JetBrains Mono fonts
- Responsive layout (mobile + desktop)

## 📄 License

MIT

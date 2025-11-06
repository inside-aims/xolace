// components/post-form/overlays/strategies/quotesDatabase.ts

export interface Quote {
  id: string; // 🆕 Added for tracking
  text: string;
  icon: string;
  author?: string;
}

/**
 * Curated quotes for different emotional states
 * These are shown during post creation to provide emotional support
 */
export const MOOD_QUOTES: Record<string, Quote[]> = {
  // EMPATHETIC - For sad, grieving, lonely moods
  empathetic: [
    {
      id: 'emp_1',
      text: "Your feelings are valid, and so are you.",
      icon: "💜",
    },
    {
      id: 'emp_2',
      text: "It's okay to not be okay. You're not alone in this.",
      icon: "🤝",
    },
    {
      id: 'emp_3',
      text: "Taking time to feel is a sign of strength, not weakness.",
      icon: "🌱",
    },
    {
      id: 'emp_4',
      text: "Your pain deserves to be acknowledged and held with care.",
      icon: "💙",
    },
    {
      id: 'emp_5',
      text: "Even in darkness, you're still moving forward.",
      icon: "🕯️",
    },
    {
      id: 'emp_6',
      text: "This feeling won't last forever, even if it feels that way now.",
      icon: "🌅",
    },
  ],

  // UNDERSTANDING - For confused, uncertain, lost moods
  understanding: [
    {
      id: 'und_1',
      text: "Not having all the answers is perfectly human.",
      icon: "🧭",
    },
    {
      id: 'und_2',
      text: "Confusion often comes before clarity. You're on the path.",
      icon: "✨",
    },
    {
      id: 'und_3',
      text: "It's okay to take your time figuring things out.",
      icon: "🌿",
    },
    {
      id: 'und_4',
      text: "Your journey is uniquely yours, and that's beautiful.",
      icon: "🦋",
    },
    {
      id: 'und_5',
      text: "Sometimes we need to sit in the questions before finding answers.",
      icon: "🌙",
    },
  ],

  // SUPPORTIVE - For anxious, worried, stressed moods
  supportive: [
    {
      id: 'sup_1',
      text: "You've handled 100% of your difficult days so far.",
      icon: "💪",
    },
    {
      id: 'sup_2',
      text: "One breath at a time. You've got this.",
      icon: "🫁",
    },
    {
      id: 'sup_3',
      text: "Your worries don't define your worth.",
      icon: "⭐",
    },
    {
      id: 'sup_4',
      text: "It's brave to share what's weighing on you.",
      icon: "🦁",
    },
    {
      id: 'sup_5',
      text: "You're stronger than you think, even when you doubt it.",
      icon: "🌟",
    },
  ],

  // CONTEMPLATIVE - For thoughtful, reflective moods
  contemplative: [
    {
      id: 'con_1',
      text: "Every thought you're having deserves space and time.",
      icon: "🌊",
    },
    {
      id: 'con_2',
      text: "Deep thinking is a gift. Honor your inner world.",
      icon: "🔮",
    },
    {
      id: 'con_3',
      text: "Your reflections are building wisdom, piece by piece.",
      icon: "📚",
    },
    {
      id: 'con_4',
      text: "There's power in pausing to truly understand yourself.",
      icon: "🧘",
    },
    {
      id: 'con_5',
      text: "The questions you ask yourself matter just as much as the answers.",
      icon: "💭",
    },
  ],

  // ENCOURAGING - For neutral, trying moods
  encouraging: [
    {
      id: 'enc_1',
      text: "Sharing your story is an act of courage.",
      icon: "🌈",
    },
    {
      id: 'enc_2',
      text: "Your voice matters. Thank you for being here.",
      icon: "🎤",
    },
    {
      id: 'enc_3',
      text: "Every post is a step toward connection and healing.",
      icon: "🌻",
    },
    {
      id: 'enc_4',
      text: "You're creating space for authenticity. That's powerful.",
      icon: "✨",
    },
    {
      id: 'enc_5',
      text: "Your presence here makes a difference.",
      icon: "🌍",
    },
  ],
};

/**
 * Get a random quote from a category
 */
export function getRandomQuote(category: string): Quote {
  const quotes = MOOD_QUOTES[category] || MOOD_QUOTES.encouraging;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

/**
 * Get multiple unique quotes for rotation (session-aware)
 * Ensures quotes aren't repeated within the same session
 * 
 * @param category - Quote category
 * @param count - Number of quotes to return (default: 2)
 * @returns Array of unique quotes
 */
export function getQuotesForRotation(category: string, count: number = 2): Quote[] {
  const quotes = MOOD_QUOTES[category] || MOOD_QUOTES.encouraging;
  
  // Get shown quotes from session storage
  const sessionKey = `shownQuotes_${category}`;
  const shownQuotesJson = typeof window !== 'undefined' 
    ? sessionStorage.getItem(sessionKey) 
    : null;
  const shownIds: string[] = shownQuotesJson ? JSON.parse(shownQuotesJson) : [];

  // Filter out already shown quotes
  let availableQuotes = quotes.filter(q => !shownIds.includes(q.id));

  // If we've shown all quotes, reset and use full set
  if (availableQuotes.length < count) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(sessionKey, JSON.stringify([]));
    }
    availableQuotes = quotes;
  }

  // Shuffle and take requested count
  const shuffled = [...availableQuotes].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // Remember these quotes as shown
  if (typeof window !== 'undefined') {
    const newShownIds = [...shownIds, ...selected.map(q => q.id)];
    sessionStorage.setItem(sessionKey, JSON.stringify(newShownIds));
  }

  return selected;
}

/**
 * Clear shown quotes history (useful for testing or user preference)
 */
export function resetQuoteHistory(category?: string): void {
  if (typeof window === 'undefined') return;

  if (category) {
    sessionStorage.removeItem(`shownQuotes_${category}`);
  } else {
    // Clear all quote histories
    Object.keys(MOOD_QUOTES).forEach(cat => {
      sessionStorage.removeItem(`shownQuotes_${cat}`);
    });
  }
}
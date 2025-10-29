// components/post-form/overlays/strategies/quotesDatabase.ts

export interface Quote {
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
      text: "Your feelings are valid, and so are you.",
      icon: "💜",
    },
    {
      text: "It's okay to not be okay. You're not alone in this.",
      icon: "🤝",
    },
    {
      text: "Taking time to feel is a sign of strength, not weakness.",
      icon: "🌱",
    },
    {
      text: "Your pain deserves to be acknowledged and held with care.",
      icon: "💙",
    },
    {
      text: "Even in darkness, you're still moving forward.",
      icon: "🕯️",
    },
    {
      text: "This feeling won't last forever, even if it feels that way now.",
      icon: "🌅",
    },
  ],

  // UNDERSTANDING - For confused, uncertain, lost moods
  understanding: [
    {
      text: "Not having all the answers is perfectly human.",
      icon: "🧭",
    },
    {
      text: "Confusion often comes before clarity. You're on the path.",
      icon: "✨",
    },
    {
      text: "It's okay to take your time figuring things out.",
      icon: "🌿",
    },
    {
      text: "Your journey is uniquely yours, and that's beautiful.",
      icon: "🦋",
    },
    {
      text: "Sometimes we need to sit in the questions before finding answers.",
      icon: "🌙",
    },
  ],

  // SUPPORTIVE - For anxious, worried, stressed moods
  supportive: [
    {
      text: "You've handled 100% of your difficult days so far.",
      icon: "💪",
    },
    {
      text: "One breath at a time. You've got this.",
      icon: "🫁",
    },
    {
      text: "Your worries don't define your worth.",
      icon: "⭐",
    },
    {
      text: "It's brave to share what's weighing on you.",
      icon: "🦁",
    },
    {
      text: "You're stronger than you think, even when you doubt it.",
      icon: "🌟",
    },
  ],

  // CONTEMPLATIVE - For thoughtful, reflective moods
  contemplative: [
    {
      text: "Every thought you're having deserves space and time.",
      icon: "🌊",
    },
    {
      text: "Deep thinking is a gift. Honor your inner world.",
      icon: "🔮",
    },
    {
      text: "Your reflections are building wisdom, piece by piece.",
      icon: "📚",
    },
    {
      text: "There's power in pausing to truly understand yourself.",
      icon: "🧘",
    },
    {
      text: "The questions you ask yourself matter just as much as the answers.",
      icon: "💭",
    },
  ],

  // ENCOURAGING - For neutral, trying moods
  encouraging: [
    {
      text: "Sharing your story is an act of courage.",
      icon: "🌈",
    },
    {
      text: "Your voice matters. Thank you for being here.",
      icon: "🎤",
    },
    {
      text: "Every post is a step toward connection and healing.",
      icon: "🌻",
    },
    {
      text: "You're creating space for authenticity. That's powerful.",
      icon: "✨",
    },
    {
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
 * Get multiple quotes for rotation
 */
export function getQuotesForRotation(category: string, count: number = 3): Quote[] {
  const quotes = MOOD_QUOTES[category] || MOOD_QUOTES.encouraging;
  const shuffled = [...quotes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, quotes.length));
}
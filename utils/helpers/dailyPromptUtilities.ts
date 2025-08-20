
export const defaultColorThemes = {
  deep_confession: {
    gradient: 'from-pink-500 to-rose-600 dark:from-pink-600/80 dark:to-rose-700/80',
    accent: 'text-pink-300/50 dark:text-pink-500/50',
    button: 'bg-white text-rose-700 hover:bg-pink-50',
    glow: 'bg-pink-400/30'
  },
  life_lessons: {
    gradient: 'from-amber-500 to-orange-600 dark:from-amber-600/80 dark:to-orange-700/80',
    accent: 'text-amber-300/50 dark:text-amber-500/50',
    button: 'bg-white text-orange-700 hover:bg-amber-50',
    glow: 'bg-amber-400/30'
  },
  fun_playful: {
    gradient: 'from-cyan-500 to-teal-600 dark:from-cyan-600/80 dark:to-teal-700/80',
    accent: 'text-cyan-300/50 dark:text-cyan-500/50',
    button: 'bg-white text-teal-700 hover:bg-cyan-50',
    glow: 'bg-cyan-400/30'
  },
  controversial: {
    gradient: 'from-orange-500 to-red-600 dark:from-orange-600/80 dark:to-red-700/80',
    accent: 'text-orange-300/50 dark:text-orange-500/50',
    button: 'bg-white text-red-700 hover:bg-orange-50',
    glow: 'bg-orange-400/30'
  },
  motivational: {
    gradient: 'from-emerald-500 to-green-600 dark:from-emerald-600/80 dark:to-green-700/80',
    accent: 'text-emerald-300/50 dark:text-emerald-500/50',
    button: 'bg-white text-green-700 hover:bg-emerald-50',
    glow: 'bg-emerald-400/30'
  },
  creative: {
    gradient: 'from-purple-500 to-indigo-600 dark:from-purple-600/80 dark:to-indigo-700/80',
    accent: 'text-purple-300/50 dark:text-purple-500/50',
    button: 'bg-white text-indigo-700 hover:bg-purple-50',
    glow: 'bg-purple-400/30'
  },
  relationship: {
    gradient: 'from-pink-500 to-purple-600 dark:from-pink-600/80 dark:to-purple-700/80',
    accent: 'text-pink-300/50 dark:text-pink-500/50',
    button: 'bg-white text-purple-700 hover:bg-pink-50',
    glow: 'bg-pink-400/30'
  },
  career: {
    gradient: 'from-blue-500 to-indigo-600 dark:from-blue-600/80 dark:to-indigo-700/80',
    accent: 'text-blue-300/50 dark:text-blue-500/50',
    button: 'bg-white text-indigo-700 hover:bg-blue-50',
    glow: 'bg-blue-400/30'
  },
  mindfulness: {
    gradient: 'from-indigo-500 to-purple-600 dark:from-indigo-600/80 dark:to-purple-700/80',
    accent: 'text-indigo-300/50 dark:text-indigo-500/50',
    button: 'bg-white text-purple-700 hover:bg-indigo-50',
    glow: 'bg-indigo-400/30'
  },
  gratitude: {
    gradient: 'from-yellow-500 to-amber-600 dark:from-yellow-600/80 dark:to-amber-700/80',
    accent: 'text-yellow-300/50 dark:text-yellow-500/50',
    button: 'bg-white text-amber-700 hover:bg-yellow-50',
    glow: 'bg-yellow-400/30'
  },
  // Default fallback
  default: {
    gradient: 'from-purple-600 to-lavender-700 dark:from-ocean-700/80 dark:to-lavender-800/80',
    accent: 'text-purple-300/50 dark:text-purple-500/50',
    button: 'bg-white text-purple-700 hover:bg-gray-100',
    glow: 'bg-purple-400/30'
  }
} as const;

// Utility function to get theme colors
export function getThemeColors(category?: string, customGradient?: { from: string; to: string }) {
  if (customGradient) {
    // If we have custom colors from database, create dynamic styles
    return {
      style: {
        background: `linear-gradient(135deg, ${customGradient.from}, ${customGradient.to})`
      },
      accent: 'text-white/80',
      button: 'bg-white/90 text-gray-800 hover:bg-white',
      glow: 'bg-white/20'
    };
  }

  const theme = category && category in defaultColorThemes 
    ? defaultColorThemes[category as keyof typeof defaultColorThemes]
    : defaultColorThemes.default;
    
  return {
    gradient: `bg-gradient-to-br ${theme.gradient}`,
    accent: theme.accent,
    button: theme.button,
    glow: theme.glow
  };
}

// Utility to get category icon based on type
export function getCategoryIcon(category?: string) {
  const icons = {
    deep_confession: '💭',
    life_lessons: '💡',
    fun_playful: '🎉',
    controversial: '🔥',
    motivational: '💪',
    creative: '🎨',
    relationship: '💝',
    career: '💼',
    mindfulness: '🧘',
    gratitude: '🙏'
  };

  return icons[category as keyof typeof icons] || '✨';
}
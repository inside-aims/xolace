export * from './post';

export type Mood = {
  id: number;
  label: string;
  value: string;
  icon: string;
  color: string;
  gif?: string;
};

// Map mood to emoji and button style
export const moodMap: Record<
  string,
  { emoji: string; style: string; gif?: string }
> = {
  neutral: { emoji: '😐', style: ' bg-pink-500' },
  happy: { emoji: '😆', style: 'border-green-500 bg-green-400' },
  sad: {
    emoji: '🥹',
    style: 'bg-blue-400',
    gif: '/assets/gifs/post-moods/sad-deactivate.gif',
  },
  angry: { emoji: '😠', style: 'border-red-500 bg-red-400',gif: '/assets/gifs/post-moods/angry-unscreen.gif' },
  confused: { emoji: '🫤', style: 'border-yellow-500 bg-yellow-400' },
};


export type Frontmatter = {
  title: string;
  author_name: string;
  created_at: Date;
  content: string;
};

export type HealthTip = Frontmatter & { id: number };

// interfaces/policy.ts

export interface PolicySection {
  id: string
  title: string
  level: number // e.g., 2 = h2, 3 = h3, etc.
}

export interface Policy {
  id: string
  title: string
  description: string
  category: 'Community' | 'Legal' | 'Safety' | 'Technology' | string
  version: string
  lastUpdated: string // e.g., "June 19, 2025"
  sections: PolicySection[]
  content: string // markdown content or serialized HTML
}
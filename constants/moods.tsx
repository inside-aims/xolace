import {
  Smile,
  Zap,
  Brain,
  Coffee,
  Heart,
  Frown,
  Angry,
  Meh,
  Laugh,
  Star,
  Sun,
  Moon,
  CloudRain,
  Palette,
  Camera,
  Music,
} from 'lucide-react';
import React from 'react';

export interface MoodType {
  id:
    | 'neutral'
    | 'confused'
    | 'sad'
    | 'happy'
    | 'angry'
    | 'thoughtful'
    | 'chill'
    | 'grateful'
    | 'laughing'
    | 'inspired'
    | 'peaceful'
    | 'melancholy'
    | 'creative'
    | 'nostalgic'
    | 'motivated'
    | 'excited'
    | 'energetic';
  label: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
}

export const moodIcons: Record<string, React.ReactNode> = {
  happy: <Smile className="h-4 w-4" />,
  excited: <Zap className="h-4 w-4" />,
  thoughtful: <Brain className="h-4 w-4" />,
  chill: <Coffee className="h-4 w-4" />,
  grateful: <Heart className="h-4 w-4" />,
  sad: <Frown className="h-4 w-4" />,
  angry: <Angry className="h-4 w-4" />,
  neutral: <Meh className="h-4 w-4" />,
  laughing: <Laugh className="h-4 w-4" />,
  inspired: <Star className="h-4 w-4" />,
  energetic: <Sun className="h-4 w-4" />,
  peaceful: <Moon className="h-4 w-4" />,
  melancholy: <CloudRain className="h-4 w-4" />,
  creative: <Palette className="h-4 w-4" />,
  nostalgic: <Camera className="h-4 w-4" />,
  motivated: <Music className="h-4 w-4" />,
};

export const moodColors: Record<string, string> = {
  happy: 'bg-yellow-400',
  excited: 'bg-orange-400',
  thoughtful: 'bg-purple-400',
  chill: 'bg-blue-400',
  grateful: 'bg-pink-400',
  sad: 'bg-slate-400',
  angry: 'bg-red-400',
  neutral: 'bg-gray-400',
  laughing: 'bg-emerald-400',
  inspired: 'bg-amber-400',
  energetic: 'bg-lime-400',
  peaceful: 'bg-indigo-400',
  melancholy: 'bg-cyan-400',
  creative: 'bg-violet-400',
  nostalgic: 'bg-rose-400',
  motivated: 'bg-teal-400',
};

export const moods: MoodType[] = [
  {
    id: 'happy',
    label: 'Happy',
    icon: <Smile className="h-4 w-4" />,
    color: 'bg-yellow-400',
    hoverColor: 'hover:bg-yellow-500',
  },
  {
    id: 'excited',
    label: 'Excited',
    icon: <Zap className="h-4 w-4" />,
    color: 'bg-orange-400',
    hoverColor: 'hover:bg-orange-500',
  },
  {
    id: 'thoughtful',
    label: 'Thoughtful',
    icon: <Brain className="h-4 w-4" />,
    color: 'bg-purple-400',
    hoverColor: 'hover:bg-purple-500',
  },
  {
    id: 'chill',
    label: 'Chill',
    icon: <Coffee className="h-4 w-4" />,
    color: 'bg-blue-400',
    hoverColor: 'hover:bg-blue-500',
  },
  {
    id: 'grateful',
    label: 'Grateful',
    icon: <Heart className="h-4 w-4" />,
    color: 'bg-pink-400',
    hoverColor: 'hover:bg-pink-500',
  },
  {
    id: 'sad',
    label: 'Sad',
    icon: <Frown className="h-4 w-4" />,
    color: 'bg-slate-400',
    hoverColor: 'hover:bg-slate-500',
  },
  {
    id: 'angry',
    label: 'Angry',
    icon: <Angry className="h-4 w-4" />,
    color: 'bg-red-400',
    hoverColor: 'hover:bg-red-500',
  },
  {
    id: 'neutral',
    label: 'Neutral',
    icon: <Meh className="h-4 w-4" />,
    color: 'bg-gray-400',
    hoverColor: 'hover:bg-gray-500',
  },
  {
    id: 'laughing',
    label: 'Laughing',
    icon: <Laugh className="h-4 w-4" />,
    color: 'bg-emerald-400',
    hoverColor: 'hover:bg-emerald-500',
  },
  {
    id: 'inspired',
    label: 'Inspired',
    icon: <Star className="h-4 w-4" />,
    color: 'bg-amber-400',
    hoverColor: 'hover:bg-amber-500',
  },
  {
    id: 'energetic',
    label: 'Energetic',
    icon: <Sun className="h-4 w-4" />,
    color: 'bg-lime-400',
    hoverColor: 'hover:bg-lime-500',
  },
  {
    id: 'peaceful',
    label: 'Peaceful',
    icon: <Moon className="h-4 w-4" />,
    color: 'bg-indigo-400',
    hoverColor: 'hover:bg-indigo-500',
  },
  {
    id: 'melancholy',
    label: 'Melancholy',
    icon: <CloudRain className="h-4 w-4" />,
    color: 'bg-cyan-400',
    hoverColor: 'hover:bg-cyan-500',
  },
  {
    id: 'creative',
    label: 'Creative',
    icon: <Palette className="h-4 w-4" />,
    color: 'bg-violet-400',
    hoverColor: 'hover:bg-violet-500',
  },
  {
    id: 'nostalgic',
    label: 'Nostalgic',
    icon: <Camera className="h-4 w-4" />,
    color: 'bg-rose-400',
    hoverColor: 'hover:bg-rose-500',
  },
  {
    id: 'motivated',
    label: 'Motivated',
    icon: <Music className="h-4 w-4" />,
    color: 'bg-teal-400',
    hoverColor: 'hover:bg-teal-500',
  },
];

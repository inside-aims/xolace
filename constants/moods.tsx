import { Smile, Zap, Brain, Coffee, Heart, Frown, Angry, Meh, Laugh, Star, Sun, Moon, CloudRain, Palette, Camera, Music } from 'lucide-react';
import React from 'react';

export const moodIcons: Record<string, React.ReactNode> = {
    happy: <Smile className="w-4 h-4" />,
    excited: <Zap className="w-4 h-4" />,
    thoughtful: <Brain className="w-4 h-4" />,
    chill: <Coffee className="w-4 h-4" />,
    grateful: <Heart className="w-4 h-4" />,
    sad: <Frown className="w-4 h-4" />,
    angry: <Angry className="w-4 h-4" />,
    neutral: <Meh className="w-4 h-4" />,
    laughing: <Laugh className="w-4 h-4" />,
    inspired: <Star className="w-4 h-4" />,
    energetic: <Sun className="w-4 h-4" />,
    peaceful: <Moon className="w-4 h-4" />,
    melancholy: <CloudRain className="w-4 h-4" />,
    creative: <Palette className="w-4 h-4" />,
    nostalgic: <Camera className="w-4 h-4" />,
    motivated: <Music className="w-4 h-4" />,
  }
  
  export const moodColors: Record<string, string> = {
    happy: "bg-yellow-400",
    excited: "bg-orange-400",
    thoughtful: "bg-purple-400",
    chill: "bg-blue-400",
    grateful: "bg-pink-400",
    sad: "bg-slate-400",
    angry: "bg-red-400",
    neutral: "bg-gray-400",
    laughing: "bg-emerald-400",
    inspired: "bg-amber-400",
    energetic: "bg-lime-400",
    peaceful: "bg-indigo-400",
    melancholy: "bg-cyan-400",
    creative: "bg-violet-400",
    nostalgic: "bg-rose-400",
    motivated: "bg-teal-400",
  }
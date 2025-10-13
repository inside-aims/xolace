'use client';

import React from 'react';
import {Award, Timer, Video} from 'lucide-react';

interface TopBarProps {
  mentorName: string;
  sessionTime: string;
  isRecording: boolean;
}

export default function TopBar({ mentorName, sessionTime, isRecording }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-neutral-800">
      <h1 className="text-lg font-semibold">Session with {mentorName}</h1>
      <div className="flex items-center gap-3 text-sm">
        {isRecording && (
          <div className="flex items-center text-red-500 gap-1">
            <Video size={16}/> Recording
          </div>
        )}
        <div className="flex items-center gap-1 text-gray-400">
          <Timer size={16}/> {sessionTime}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:scale-105 transition flex items-center gap-2">
          <Award size={18}/>
          <span className="hidden sm:inline">End & Review</span>
        </button>
      </div>
    </div>

  );
}

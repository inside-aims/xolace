'use client';

import React from 'react';
import ActionCard from "@/components/talk-space/mentor/action-card";

interface Mentor {
  name: string;
  avatar: string;
}

interface VideoAreaProps {
  mentor: Mentor;
}

export default function VideoArea({ mentor }: VideoAreaProps) {
  return (
    <div className="flex-1 flex items-center justify-center relative">
      <img
        src={mentor.avatar}
        alt={mentor.name}
        className="w-2/3 rounded-2xl shadow-lg object-cover"
      />
      <div className="absolute bottom-6 right-6 flex gap-3">
        <ActionCard label="Take Notes" />
        <ActionCard label="Mark Goal" />
      </div>
    </div>
  );
}

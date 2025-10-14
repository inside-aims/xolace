'use client';

import React from 'react';
import { MessageCircle, FileText, Target } from 'lucide-react';
import IconButton from "@/components/talk-space/mentor/icon-button";

interface SidebarProps {
  isChatOpen: boolean;
  isNotesOpen: boolean;
  isGoalsOpen: boolean;
  onToggleChat: () => void;
  onToggleNotes: () => void;
  onToggleGoals: () => void;
}

export default function Sidebar(
  {
    isChatOpen,
    isNotesOpen,
    isGoalsOpen,
    onToggleChat,
    onToggleNotes,
    onToggleGoals,
  }: SidebarProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-3 py-6 bg-neutral-800 border-r border-white/10">
      <IconButton
        icon={MessageCircle}
        active={isChatOpen}
        onClick={onToggleChat}
        color="from-blue-600 to-cyan-600"
      />
      <IconButton
        icon={FileText}
        active={isNotesOpen}
        onClick={onToggleNotes}
        color="from-purple-600 to-pink-600"
      />
      <IconButton
        icon={Target}
        active={isGoalsOpen}
        onClick={onToggleGoals}
        color="from-green-600 to-emerald-600"
      />
    </div>
  );
}

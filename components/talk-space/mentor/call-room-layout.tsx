'use client';

import { cn } from "@/lib/utils";
import React, {useState} from 'react';
import { MessageCircle, FileText, Target, Award, Timer, Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from 'lucide-react';
import {ActionCard} from "@/components/talk-space/mentor/action-links";
import {Button} from "@/components/ui/button";

interface SidebarProps {
  isChatOpen: boolean;
  isNotesOpen: boolean;
  isGoalsOpen: boolean;
  onToggleChat: () => void;
  onToggleNotes: () => void;
  onToggleGoals: () => void;
}

interface TopBarProps {
  mentorName: string;
  sessionTime: string;
  isRecording: boolean;
}

interface Mentor {
  name: string;
  avatar: string;
}

interface VideoAreaProps {
  mentor: Mentor;
}

interface RightPanelProps {
  isChatOpen: boolean;
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon: React.ElementType;
  color?: string;
  label?: string;
}

export function Sidebar(
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

export function TopBar({ mentorName, sessionTime, isRecording }: TopBarProps) {
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

export function VideoArea({ mentor }: VideoAreaProps) {
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


export function RightPanel({isChatOpen}: RightPanelProps) {
  return (
    <div className="w-80 border-l border-white/10 bg-neutral-800 p-4 overflow-y-auto">
      {isChatOpen && <ChatPanel />}
    </div>
  );
}


export  function BottomControls({onEndASession}: {onEndASession: () => void}) {
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);

  return (
    <div className="flex items-center justify-center py-4 md:justify-around  border-t border-white/10 bg-neutral-800">
      <div className="flex items-center justify-center gap-4">
        <IconButton icon={audio ? Mic : MicOff} onClick={() => setAudio(!audio)}/>
        <IconButton icon={video ? Video : VideoOff} onClick={() => setVideo(!video)}/>
        <IconButton icon={Phone} color="from-red-600 to-pink-600"/>
      </div>
      <IconButton
        icon={PhoneOff}
        color="from-red-600 to-pink-600"
        label={"End Session"}
        onClick={onEndASession}
        className={"px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:scale-105 transition flex items-center gap-2 shadow-lg"}
      />

    </div>
  );
}

export function IconButton({ active, icon: Icon, color,label, className = '', ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={`p-3 rounded-xl transition-all ${
        active
          ? `bg-gradient-to-br ${color ?? 'from-blue-500 to-cyan-500'} text-white shadow-lg`
          : 'bg-white/10 text-gray-400 hover:bg-white/20'
      } ${className}`}
    >
      <Icon size={22} /> {label && <span className="text-lg">{label}</span>}
    </button>
  );
}

export function ChatPanel() {
  return(
    <div>
      Chat panel
    </div>
  )
}


export const CallButton = (
  {
    label,
    onStartAction,
    icon,
    size = "default",
  }: {
  label: string;
  icon?: React.ReactNode;
  onStartAction: () => void;
  size?: "lg" | "sm" | "default" | "icon";
}) => {
  const sizeClasses = {
    lg: "px-8 py-6 text-lg",
    default: "px-6 py-3 text-base",
    sm: "px-4 py-2 text-sm",
    icon: "p-3",
  };

  return (
    <Button
      onClick={onStartAction}
      className={cn(
        "flex-1 bg-gradient-to-r from-purple-400 to-lavender-600 text-white rounded-xl font-bold hover:from-purple-500 hover:to-lavender-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2",
        sizeClasses[size]
      )}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {label}
    </Button>
  );
};



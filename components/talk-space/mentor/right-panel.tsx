'use client';

import React from 'react';
import ChatPanel from "@/components/talk-space/mentor/chat-panel";


interface RightPanelProps {
  isChatOpen: boolean;
}

export default function RightPanel({isChatOpen}: RightPanelProps) {
  return (
    <div className="w-80 border-l border-white/10 bg-neutral-800 p-4 overflow-y-auto">
      {isChatOpen && <ChatPanel />}
    </div>
  );
}

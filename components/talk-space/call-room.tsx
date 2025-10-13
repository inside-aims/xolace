'use client';

import React, { useState } from 'react';
import Sidebar from "@/components/talk-space/mentor/sider-bar";
import TopBar from "@/components/talk-space/mentor/top-bar";
import VideoArea from "@/components/talk-space/mentor/video-area";
import BottomControls from "@/components/talk-space/mentor/bottom-controls";
import RightPanel from "@/components/talk-space/mentor/right-panel";


export default function CallRoom() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);

  const mentor = { name: 'Dr. Sarah Johnson', avatar: '/mentor.jpg' };

  return (
    <div className="flex flex-col h-full w-full bg-neutral-900 overflow-hidden">
      <TopBar
        mentorName={mentor.name}
        sessionTime="20:35"
        isRecording={false}
      />

      <div className="flex flex-1">
        <Sidebar
          isChatOpen={isChatOpen}
          isNotesOpen={isNotesOpen}
          isGoalsOpen={isGoalsOpen}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          onToggleNotes={() => setIsNotesOpen(!isNotesOpen)}
          onToggleGoals={() => setIsGoalsOpen(!isGoalsOpen)}
        />
        <VideoArea mentor={mentor} />
      </div>
      <BottomControls />

      {/*<RightPanel*/}
      {/*  isChatOpen={isChatOpen}*/}
      {/*/>*/}
    </div>
  );
}

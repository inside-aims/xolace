'use client';

import React, { useState } from 'react';
import {BottomControls, Sidebar, TopBar, VideoArea} from "@/components/talk-space/mentor/call-room-layout";


export default function CallRoom({onEndASessionAction} : {onEndASessionAction: () => void}) {
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
      <BottomControls onEndASession={onEndASessionAction}/>

      {/*<RightPanel*/}
      {/*  isChatOpen={isChatOpen}*/}
      {/*/>*/}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {Mic, MicOff, Video, VideoOff, Phone, PhoneOff} from 'lucide-react';
import IconButton from "@/components/talk-space/mentor/icon-button";

export default function BottomControls() {
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
        className={"px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:scale-105 transition flex items-center gap-2 shadow-lg"}
      />

    </div>
  );
}

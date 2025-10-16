'use client';

import { Video, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {CallCard, CallCardProps} from "@/components/talk-space/mentor/call-card";
import VideoPlayer from "@/components/health-space/reflection/video-player";
import {useState} from "react";

const recordings: CallCardProps[] = [
  {
    id: "1",
    title: "rec_default_ae7ac503",
    date: "2024-03-20T10:18:18.663256Z",
    participants: [
      { id:" 1", camperName: "JM" },
      { id: "2", camperName: "SK" },
      { id: "3", camperName: "AL" },
      { id: "4", camperName: "MR" },
      { id: "9", camperName: "AL" },
      { id: "10", camperName: "MR" }
    ],
  },
  {
    id: "2",
    title: "rec_default_ae7ac503",
    date: "2024-03-20T10:18:18.663256Z",
    participants: [
      { id: "1", camperName: "JM" },
      { id: "2", camperName: "SK" },
      { id: "3", camperName: "AL" },
      { id: "4", camperName: "MR" }
    ],
  },
  {
    id: "3",
    title: "rec_default_ae7ac503",
    date: "2024-03-20T10:18:18.663256Z",
    participants: [
      { id: "1", camperName: "JM" },
      { id: "2", camperName: "SK" },
      { id: "3", camperName: "AL" },
      { id: "4", camperName: "MR" }
    ],
  }
];

const MentorRecordingsPage = () => {
  const [playVideo, setPlayVideo] = useState<string>("");

  const handlePlayVideo = (recordingId: string) => {
    setPlayVideo(recordingId);
  }


  return (
    <div className="space-y-6">
      <h1 className="text-lg md:text-3xl font-semibold">
        {playVideo ? (`Recording video for ${playVideo}`) : ("Recordings")}
      </h1>
      {playVideo ? (
        <VideoPlayer videoId={playVideo}/>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recordings.map((recording) => (
            <CallCard
              key={recording.id}
              id={recording.id}
              title={recording.title}
              date={new Date(recording.date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
              participants={recording.participants}
              icon={Video}
              actions={
                <>
                  <Button
                    className="bg-lavender-500 hover:bg-lavender-600"
                    onClick={() => handlePlayVideo(recording.id)}>
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                  <Button variant="outline" className="hover:bg-ocean-600 hover:text-white">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Copy Link
                  </Button>
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorRecordingsPage;
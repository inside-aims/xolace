'use client';

import {CalendarDays, ExternalLink,} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {CallCard, CallCardProps} from "@/components/talk-space/mentor/call-card";

const upcomingMeetings: CallCardProps[] = [
  {
    id: "1",
    title: "John Doe",
    date: "2024-03-20T10:18:18.663256Z",
    participants: [
      { id: "1", camperName: "JM" },
      { id: "2", camperName: "SK" },
      { id: "3", camperName: "AL" },
    ],
  },
  {
    id: "2",
    title: "Standup Meeting",
    date: "2024-03-20T10:18:18.663256Z",
    participants: [
      { id: "1", camperName: "JM" },
      { id: "2", camperName: "SK" },
      { id: "3", camperName: "AL" },
      { id: "4", camperName: "MR" },
      { id: "7", camperName: "AL" },
    ],
  }
];


const MentorUpcomingPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-3xl font-semibold">Upcoming Meeting</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upcomingMeetings.map((meeting) => (
          <CallCard
            key={meeting.id}
            id={meeting.id}
            title={meeting.title}
            date={new Date(meeting.date).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
            participants={meeting.participants}
            icon={CalendarDays}
            actions={
              <>
                <Button className="bg-lavender-500 hover:bg-lavender-600">
                  Start
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
    </div>
  );
};
export default MentorUpcomingPage;
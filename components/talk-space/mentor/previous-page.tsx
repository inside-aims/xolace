'use client';

import {CalendarDays} from 'lucide-react';
import {CallCard, CallCardProps} from "@/components/talk-space/mentor/call-card";

const previousCalls: CallCardProps[] = [
  {
    id: "1",
    title: "Instant Meeting",
    date: "2024-03-20T10:18:18.663256Z",
    participants: [
      {id: "1", camperName: "JM"},
      {id: "2", camperName: "SK"},
      {id: "3", camperName: "AL"},
    ],
  },
  {
    id: "2",
    title: "Instant Meeting",
    date: "2024-03-20T10:18:18.663256Z",
    participants: [
      {id: "1", camperName: "JM"},
      {id: "2", camperName: "SK"},
      {id: "3", camperName: "AL"},
    ],
  },
  {
    id: "20",
    title: "Instant Meeting",
    date: "2024-03-20T10:18:18.663256Z",
    participants: [
      {id: "1", camperName: "JM"},
      {id: "2", camperName: "SK"},
      {id: "3", camperName: "AL"},
      {id: "4", camperName: "MR"}
    ],
  },
];

const MentorPreviousPage = () => {

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-3xl font-semibold">Previous Calls</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {previousCalls.map((call) => (
          <CallCard
            key={call.id}
            id={call.id}
            title={call.title}
            date={new Date(call.date).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
            participants={call.participants}
            icon={CalendarDays}
          />
        ))}
      </div>
    </div>
  );
};
export default MentorPreviousPage;
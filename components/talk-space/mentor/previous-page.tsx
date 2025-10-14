'use client';

import { CalendarDays} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const MentorPreviousPage = () => {
  const previousCalls = [
    {
      id: 1,
      title: "Instant Meeting",
      date: "27/03/2024, 14:48:09",
      participants: [
        { id: 1, initials: "JM" },
        { id: 2, initials: "SK" },
        { id: 3, initials: "AL" },
        { id: 4, initials: "MR" }
      ],
      additionalCount: 5
    },
    {
      id: 2,
      title: "Instant Meeting",
      date: "27/03/2024, 14:46:40",
      participants: [
        { id: 1, initials: "JM" },
        { id: 2, initials: "SK" },
        { id: 3, initials: "AL" },
        { id: 4, initials: "MR" }
      ],
      additionalCount: 5
    },
    {
      id: 3,
      title: "Instant Meeting",
      date: "27/03/2024, 14:45:44",
      participants: [
        { id: 1, initials: "JM" },
        { id: 2, initials: "SK" },
        { id: 3, initials: "AL" },
        { id: 4, initials: "MR" }
      ],
      additionalCount: 5
    },
    {
      id: 4,
      title: "Standup Meeting",
      date: "27/03/2024, 14:45:00",
      participants: [
        { id: 1, initials: "JM" },
        { id: 2, initials: "SK" },
        { id: 3, initials: "AL" },
        { id: 4, initials: "MR" }
      ],
      additionalCount: 5
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Previous Calls</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {previousCalls.map((call) => (
          <Card key={call.id} className="bg-white shadow-sm dark:bg-neutral-800 border transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-start gap-3">
                <CalendarDays className="w-8 h-8 text-neutral-400 mt-1" />
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{call.title}</CardTitle>
                  <CardDescription className="text-neutral-400">
                    {call.date}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {call.participants.map((participant, idx) => (
                  <Avatar key={participant.id} className={`w-10 h-10 border-2 border-slate-800 ${idx > 0 ? '-ml-3' : ''}`}>
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                      {participant.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <Badge variant="secondary" className="ml-2 border shadow-sm dark:bg-neutral-500">
                  +{call.additionalCount}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default MentorPreviousPage;
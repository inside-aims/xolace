'use client';

import { Video, Play, ExternalLink} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const MentorRecordingsPage = () => {
  const recordings = [
    {
      id: 1,
      title: "rec_default_ae7ac503",
      date: "2024-03-20T10:18:18.663256Z",
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
      title: "rec_default_ae7ac503",
      date: "2024-03-20T10:18:18.663256Z",
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
      title: "rec_default_ae7ac503",
      date: "2024-03-20T10:18:18.663256Z",
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
      <h1 className="text-4xl font-bold ">Recordings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recordings.map((recording) => (
          <Card key={recording.id} className="bg-white shadow-sm dark:bg-neutral-800 border transition-colors">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Video className="w-8 h-8 text-neutral-400 mt-1" />
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{recording.title}</CardTitle>
                  <CardDescription className="text-neutral-400">
                    {new Date(recording.date).toLocaleString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {recording.participants.map((participant, idx) => (
                    <Avatar key={participant.id} className={`w-10 h-10 border-2 border-slate-800 ${idx > 0 ? '-ml-3' : ''}`}>
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                        {participant.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <Badge variant="secondary" className="ml-2 shadow-md border">
                    +{recording.additionalCount}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button className="bg-lavender-500 hover:bg-lavender-600">
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                  <Button variant="outline" className="border-lavender-600  hover:bg-lavender-700">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default MentorRecordingsPage
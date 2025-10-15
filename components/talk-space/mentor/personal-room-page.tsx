'use client';

import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Copy, Video} from "lucide-react";

const MentorPersonalRoomPage = () => {
  const [copied, setCopied] = useState(false);

  const meetingData = {
    topic: "DoeDiego Meeting Room",
    meetingId: "user_2dwpWYOcMMeoXapfDNoLY48cwxb",
    inviteLink: "https://yoom.vercel.app/meeting/user_2dwpWYOcMMeoXapfDNoLY48cwx..."
  };

  const handleCopyInvitation = () => {
    navigator.clipboard.writeText(meetingData.inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Personal Meeting Room</h1>

      <Card className="bg-white shadow-sm dark:bg-neutral-800 border">
        <CardHeader>
          <CardTitle className="text-2xl">Your Meeting Room Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-1">Topic:</p>
              <p className="text-lg font-medium">{meetingData.topic}</p>
            </div>

            <div>
              <p className="text-sm mb-1">Meeting ID:</p>
              <p className="text-lg font-mono">{meetingData.meetingId}</p>
            </div>

            <div>
              <p className="text-sm mb-1">Invite Link:</p>
              <p className="text-lg font-mono break-all">{meetingData.inviteLink}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="bg-lavender-500 hover:bg-lavender-600">
              <Video className="w-4 h-4 mr-2" />
              Start Meeting
            </Button>
            <Button
              variant="secondary"
              onClick={handleCopyInvitation}
              className="bg-ocean-700 hover:bg-ocean-600 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Invitation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorPersonalRoomPage;
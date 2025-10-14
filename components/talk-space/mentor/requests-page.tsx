'use client';

import { useState } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const MentorRequestsPage = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      camperName: "Sarah Johnson",
      camperInitials: "SJ",
      requestedDate: "28/03/2024",
      requestedTime: "14:30:00",
      topic: "Career Guidance Session",
      message: "Hi! I'd love to discuss career paths in software development.",
      status: "pending"
    },
    {
      id: 2,
      camperName: "Mike Chen",
      camperInitials: "MC",
      requestedDate: "29/03/2024",
      requestedTime: "16:00:00",
      topic: "Code Review Session",
      message: "Need help reviewing my React project.",
      status: "pending"
    },
    {
      id: 3,
      camperName: "Emily Davis",
      camperInitials: "ED",
      requestedDate: "30/03/2024",
      requestedTime: "10:00:00",
      topic: "Interview Preparation",
      message: "Preparing for upcoming technical interviews.",
      status: "pending"
    }
  ]);

  const handleAccept = (id: number) => {
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: 'accepted' } : req
    ));
  };

  const handleReject = (id: number) => {
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: 'rejected' } : req
    ));
  };

  const handleReschedule = (id: number) => {
    alert('Reschedule dialog would open here');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Meeting Requests</h1>
        <Badge className="bg-blue-600 text-white px-3 py-1 text-lg">
          {requests.filter(r => r.status === 'pending').length} Pending
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {requests.map((request) => (
          <Card key={request.id} className={`border-slate-700 transition-all ${
            request.status === 'accepted' ? 'bg-green-900/20 border-green-700' :
              request.status === 'rejected' ? 'bg-red-900/20 border-red-700' :
                'bg-slate-800 dark:bg-slate-900'
          }`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-semibold">
                      {request.camperInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-white text-xl mb-1">{request.camperName}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {request.topic}
                    </CardDescription>
                  </div>
                </div>
                {request.status === 'accepted' && (
                  <Badge className="bg-green-600">Accepted</Badge>
                )}
                {request.status === 'rejected' && (
                  <Badge className="bg-red-600">Rejected</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>{request.requestedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{request.requestedTime}</span>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-slate-300 text-sm italic">{request.message}</p>
              </div>

              {request.status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <Button
                    className="bg-green-600 hover:bg-green-700 flex-1"
                    onClick={() => handleAccept(request.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-400 hover:bg-blue-900/20 flex-1"
                    onClick={() => handleReschedule(request.id)}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-900/20 flex-1"
                    onClick={() => handleReject(request.id)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default MentorRequestsPage;
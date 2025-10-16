import { useState } from 'react';
import { Inbox, Check, X, Calendar, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface IncomingRequestInterface {
  id: string,
  camperName: string,
  date: string;
  time: string,
  topic?: string,
  message?: string,
  status: "pending" | "accepted" | "rejected"
}

const requests: IncomingRequestInterface[] = [
  {
    id: "1",
    camperName: "Sarah Johnson",
    date: "28/03/2024",
    time: "14:30",
    topic: "Career Guidance Session",
    message: "Hi! I'd love to discuss career paths in software development and get your insights.",
    status: "pending"
  },
  {
    id: "2",
    camperName: "Mike Chen",
    date: "29/03/2024",
    time: "16:00",
    topic: "Code Review Session",
    message: "Need help reviewing my React project and discussing best practices.",
    status: "pending"
  },
  {
    id:" 3",
    camperName: "Emily Davis",
    date: "30/03/2024",
    time: "10:00",
    topic: "Interview Preparation",
    message: "Preparing for upcoming technical interviews at major tech companies.",
    status: "pending"
  },
  {
    id: "4",
    camperName: "James Wilson",
    date: "31/03/2024",
    time: "15:30",
    topic: "Portfolio Review",
    message: "Would love feedback on my portfolio website and project selection.",
    status: "pending"
  }
]
export default function MentorIncomingRequestsPage() {

  const handleAccept = (id: string) => {
  };

  const handleReject = (id: string) => {
  };

  const handleReschedule = (id: string) => {
    console.log('Open reschedule modal for:', id);
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-lg md:text-3xl font-semibold">
              Incoming Requests
            </h1>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 ">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-semibold ">{pendingCount} Pending</span>
            </div>
          )}
        </div>

        {requests.length === 0 ? (
          <div className="bg-white shadow-sm dark:bg-neutral-800 border rounded-2xl p-16 text-center">
            <Inbox className="w-20 h-20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
            <p className="text-neutral-500 dark:text-neutral-300">No pending requests at the moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
             <IncomingRequestCard
             key={request.id}
             request={request}
             onAccept={handleAccept}
             onReschedule={handleReschedule}
             onReject={handleReject}
             />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const IncomingRequestCard = (
  {
    request,
    onAccept,
    onReject,
    onReschedule
  }: {
    request: IncomingRequestInterface,
    onAccept: (id: string) => void,
    onReschedule: (id: string) => void,
    onReject: (id: string) => void,
  }) => {
  const [ expandedId, setExpandedId] = useState<string | null>(null);
  return (
    <div
      key={request.id}
      className="bg-white shadow-sm dark:bg-neutral-800 border rounded-xl transition-all duration-300 overflow-hidden group"
    >
      <div
        className="p-5 cursor-pointer"
        onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
      >
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 border-2 border-white dark:border-slate-700 shadow-lg">
            <AvatarFallback className="bg-gradient-to-r uppercase from-purple-400 to-lavender-600 text-white text-lg font-bold">
              {request.camperName.slice(0,2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold">
                {request.camperName}
              </h3>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-0">
                New
              </Badge>
            </div>
            {request.topic && (
              <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">{request.topic}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4"/>
                <span>{request.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4"/>
                <span>{request.time}</span>
              </div>
            </div>
          </div>
          <ChevronRight
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
              expandedId === request.id ? 'rotate-90' : ''
            }`}
          />
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          expandedId === request.id ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-5 pb-5 pt-2 border-t bg-white shadow-sm dark:bg-neutral-800 border ">
          <div
            className="mb-4 p-4 bg-white shadow-sm dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-500">
            {request.message && (
              <p className="text-sm  italic leading-relaxed">
                {request.message}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onAccept(request.id);
              }}
            >
              <Check className="w-4 h-4 mr-2"/>
              Accept Request
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 shadow-md hover:shadow-lg transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onReschedule(request.id)
              }}
            >
              <Calendar className="w-4 h-4 mr-2"/>
              Propose New Time
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-2 border-red-500 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950 shadow-md hover:shadow-lg transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onReject(request.id)
              }}
            >
              <X className="w-4 h-4 mr-2"/>
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
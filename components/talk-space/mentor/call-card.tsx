import {LucideIcon} from 'lucide-react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';

interface Participant {
  id: number;
  initials: string;
}

interface CallCardProps {
  id: number;
  title: string;
  date: string;
  participants: Participant[];
  additionalCount: number;
  icon: LucideIcon;
  actions?: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
}

export const CallCard = (
  {
    id,
    title,
    date,
    participants,
    additionalCount,
    icon: Icon,
    actions,
    clickable = false,
    onClick
  }: CallCardProps) => {
  return (
    <Card
      key={id}
      className={`bg-white shadow-sm dark:bg-neutral-800 border transition-colors ${
        clickable ? 'cursor-pointer hover:shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start gap-3">
          <Icon className="w-8 h-8 text-neutral-400 mt-1"/>
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{title}</CardTitle>
            <CardDescription className="text-neutral-400">
              {date}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {participants.map((participant, idx) => (
              <Avatar
                key={participant.id}
                className={`w-10 h-10 border-2 border-slate-800 ${idx > 0 ? '-ml-3' : ''}`}
              >
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                  {participant.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            <Badge variant="secondary" className="ml-2 shadow-md border dark:bg-neutral-500">
              +{additionalCount}
            </Badge>
          </div>

          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
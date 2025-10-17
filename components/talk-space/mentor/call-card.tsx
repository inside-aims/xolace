import {LucideIcon} from 'lucide-react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';

interface Participant {
  id: string;
  camperName: string;
}

export interface CallCardProps {
  id: string;
  title: string;
  date: string;
  participants: Participant[];
  icon?: LucideIcon;
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
    icon: Icon,
    actions,
    clickable = false,
    onClick,
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
          {Icon && <Icon className="w-8 h-8 text-neutral-400 mt-1"/>}
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{title}</CardTitle>
            <CardDescription className="text-neutral-400">{date}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <AvatarGroup
            participants={participants}
            limit={3}
            className="md:hidden"
          />
          <AvatarGroup
            participants={participants}
            limit={4}
            className="hidden md:flex"
          />

          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

const AvatarGroup = (
  {
    participants,
    limit,
    className = '',
  }: {
    participants: Participant[];
    limit: number;
    className?: string;
  }) => {
  const visible = participants.slice(0, limit);
  const remaining = participants.length - visible.length;

  return (
    <div className={`flex items-center ${className}`}>
      {visible.map((participant, idx) => (
        <Avatar
          key={participant.id}
          className={`w-10 h-10 border-2 ${idx > 0 ? '-ml-3' : ''}`}
        >
          <AvatarFallback className="bg-gradient-to-r uppercase from-purple-400 to-lavender-600 text-white text-xs">
            {participant.camperName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      ))}

      {remaining > 0 && (
        <Badge
          variant="secondary"
          className="ml-1 shadow-md border dark:bg-neutral-500"
        >
          +{remaining}
        </Badge>
      )}
    </div>
  );
};

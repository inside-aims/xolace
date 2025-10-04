import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

interface Campfire {
  campfireId: string;
  name: string;
  slug: string;
  description: string;
  members: number;
  iconURL?: string;
  isMember: boolean;
}

interface CampfireCardProps {
  campfire: Campfire;
  isJoining: boolean;
  onJoin: (campfireId: string) => void;
}

export default function OnboardingCampfireCard({
  campfire,
  isJoining,
  onJoin,
}: CampfireCardProps) {
  const { campfireId, name, description, members, iconURL, isMember } = campfire;

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg shadow dark:shadow-none border dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 transition-all dark:hover:border-gray-600 dark:hover:bg-gray-800/70">
      <div className="flex min-w-0 flex-1 gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={iconURL} alt={name} />
          <AvatarFallback className="border-lavender-500 flex h-10 w-10 items-center justify-center rounded-full border font-semibold text-white">
            <span className="bg-lavender-500 flex h-9 w-9 items-center justify-center rounded-full font-semibold text-white">
              x/
            </span>
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col">
          <h4 className="truncate font-semibold dark:text-white">{name}</h4>
          <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          <p className="mt-1 text-xs dark:text-gray-500">{members} members</p>
        </div>
      </div>

      <div className="flex-shrink-0">
        {isMember ? (
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-full border-gray-600 px-3 text-xs text-gray-400"
            disabled
          >
            Joined
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => onJoin(campfireId)}
            disabled={isJoining}
            className="h-8 rounded-full bg-indigo-600 px-3 text-xs hover:bg-indigo-700"
          >
            {isJoining ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Joining...
              </>
            ) : (
              'Join'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
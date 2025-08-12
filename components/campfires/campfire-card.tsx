import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import React from 'react';
import { CampfirePurpose } from '@/components/campfires/campfires.types';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CampfireCardProps {
  campfireId: string;
  name: string;
  slug: string;
  description: string;
  members: number;
  purpose: CampfirePurpose;
  onJoin?: () => void;
  iconURL?: string;
  isMember: boolean;
}

const CampfireCard = (campfire: CampfireCardProps) => {
  const getBgSeverity = (purpose: string) => {
    switch (purpose) {
      case CampfirePurpose.Creative:
        return 'bg-green-200 text-green-800';
      case CampfirePurpose.Growth:
        return 'bg-orange-200 text-orange-800';
      case CampfirePurpose.Support:
        return 'bg-yellow-200 text-yellow-800';
      default:
        return 'bg-neutral-200 text-neutral-800';
    }
  };

  // Handle members count to human readable
  function formatMembers(count: number): string {
    if (count >= 1_000_000) {
      return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (count >= 1_000) {
      return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
  }

  return (
    <Card
      key={campfire.campfireId}
      className="flex h-full flex-col rounded-[20px] bg-slate-400/20 border-0 dark:bg-zinc-800/80 transition-shadow hover:shadow-lg dark:hover:shadow-[0_4px_14px_rgba(255,255,255,0.2)]"
    >
      <Link href={`/x/${campfire.slug}`}>
        <CardHeader className="items-start space-y-1 pb-3">
          <div className="flex w-full items-start justify-between gap-4">
            <CardTitle className={'text-lg'}>{campfire.name}</CardTitle>
            {campfire.iconURL ? (
              <Avatar>
              <AvatarImage className="h-8 w-8 rounded-full" src={campfire.iconURL || undefined} alt={campfire.name} />
              <AvatarFallback className="border-lavender-500 flex h-8 w-8 items-center justify-center rounded-full border font-semibold text-white"><span
                  className={`bg-lavender-500 flex h-7 w-7 items-center justify-center rounded-full font-semibold text-white`}
                >
                  x/
                </span></AvatarFallback>
            </Avatar>
            ) : (
              <p
                className={`border-lavender-500 flex h-8 w-8 items-center justify-center rounded-full border font-semibold text-white`}
              >
                <span
                  className={`bg-lavender-500 flex h-7 w-7 items-center justify-center rounded-full font-semibold text-white`}
                >
                  x/
                </span>
              </p>
            )}
          </div>
          <CardDescription>{campfire.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <Badge className={`${getBgSeverity(campfire.purpose)} font-normal`}>
            {`${campfire.purpose.replace('_', ' ')}`}
          </Badge>
        </CardContent>
      </Link>
      <CardFooter className="mt-auto flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {formatMembers(campfire.members)} members
        </span>
        {!campfire.isMember && (
          <Button
            onClick={() => campfire.onJoin?.()}
            size="sm"
            className={
              'bg-lavender-500 hover:bg-lavender-600 items-center rounded-lg px-4 text-white'
            }
          >
            Join
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
export default CampfireCard;

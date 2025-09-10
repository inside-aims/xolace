'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Book, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import Link from 'next/link';
import { useUserState } from '@/lib/store/user';
import { isValidUrl, substituteUsername } from '@/utils';

interface GuidePreview {
  campfireName: string;
  welcomeMsg: string;
  resource?: { label: string; value: string }[];
  icon: string | null;
  modTitle?: string;
}

const GuidePreview = ({
  campfireName,
  welcomeMsg,
  resource,
  modTitle = "Campfire Mod Team",
  icon,
}: GuidePreview) => {

  const user = useUserState(state => state.user);

  const subsitutedWelcomeMsg = substituteUsername(welcomeMsg, user?.username || '');

  return (
    <div className="flex w-full flex-col gap-4 pt-2">
      <div className="flex flex-col items-center gap-2 text-center">
        <Avatar className="h-16 w-16 rounded-full">
          <AvatarImage
            src={icon || ''}
            className="h-full w-full rounded-full border object-cover object-center"
          />
          <AvatarFallback className="flex items-center justify-center bg-gradient-to-tr from-orange-400 to-pink-400 text-xl font-bold text-white">
            🔥
          </AvatarFallback>
        </Avatar>
        <h4 className="text-xl font-semibold">{campfireName}</h4>
      </div>

      <div className={'flex w-full flex-col items-start gap-1'}>
        <Alert className="rounded-xl bg-neutral-50 dark:bg-neutral-900">
          <AlertDescription className="flex flex-wrap items-center gap-1 text-sm">
            {subsitutedWelcomeMsg}
          </AlertDescription>
        </Alert>

        <div className="text-muted-foreground text-sm">
          {`- ${modTitle}`}
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        <p className="font-medium">Resources</p>
        {resource &&
          resource.map((item, i) => (
            isValidUrl(item.value) ?
           <Link key={`${item.label}-${i}`} href={item.value} target='_blank'>
            <div
              className="text-muted-foreground flex w-full items-center justify-between text-sm group"
            >
              <p className={'flex flex-row gap-1'}>
                <Book className={'h-4 w-4'} />
                <span>{item.label}</span>
              </p>
              <span className="rounded-full p-1 transition-colors duration-200 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700">
              <ChevronRight className="h-5 w-5 text-gray-400" />
              </span>
            </div>
           </Link> : 
           (
            <div
            className="text-muted-foreground flex w-full items-center justify-between text-sm group"
          >
            <p className={'flex flex-row gap-1'}>
              <Book className={'h-4 w-4'} />
              <span>{item.label}</span>
            </p>
            <span className="rounded-full p-1 group-hover:cursor-not-allowed">
            <ChevronRight className="h-5 w-5 text-gray-400" />
            </span>
          </div>
           )
          ))}
      </div>

      <Button className="bg-lavender-500 hover:bg-lavender-600 rounded-full text-white">
        Got It
      </Button>

      <p className="text-muted-foreground text-center text-xs">
        Access the campfire guide any time in the sidebar
      </p>
    </div>
  );
};
export default GuidePreview;

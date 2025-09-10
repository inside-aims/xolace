'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Book, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

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
  return (
    <div className="flex w-full flex-col gap-4">
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
            {welcomeMsg}
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
            <div
              key={`${item.label}-${i}`}
              className="text-muted-foreground flex w-full items-center justify-between text-sm"
            >
              <p className={'flex flex-row gap-1'}>
                <Book className={'h-4 w-4'} />
                <span>{item.label}</span>
              </p>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
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

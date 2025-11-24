import React from 'react';
import { Info, Mic, SmileIcon, Zap } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export function InfoPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Feature information"
        >
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 dark:bg-bg-dark bg-bg" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Features</h4>
            <p className="text-sm text-muted-foreground">
              Quick guide to the available tools.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium flex items-center gap-1">
                <SmileIcon className="h-4 w-4" /> Emoji</span>
              <span className="col-span-2 text-sm text-muted-foreground">
                Add emojis to express yourself
              </span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium flex items-center gap-1">
                <Mic className="h-4 w-4" /> Voice</span>
              <span className="col-span-2 text-sm text-muted-foreground">
                Record & transcribe (max 2mins)
              </span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium flex items-center gap-1">
                <Zap className="h-4 w-4" /> Mood</span>
              <span className="col-span-2 text-sm text-muted-foreground">
                Choose how you feeling
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

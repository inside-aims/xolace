'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Ellipsis,ListTree, LogOut } from "lucide-react"

interface ModeratorActionsPopoverProps {
  onTeamOrder?: () => void;
  onLeaveModTeam?: () => void;
}

const ModeratorActionsPopover: React.FC<ModeratorActionsPopoverProps> = ({onLeaveModTeam, onTeamOrder}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`rounded-full border border-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors`}
          aria-label="More options"
        >
          <Ellipsis size={14} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-56 p-0 bg-bg dark:bg-bg-dark"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="py-2">
          <div className="px-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2"
              onClick={onTeamOrder}
            >
              <ListTree className="mr-2 h-4 w-4" />
              Edit team order
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2"
              onClick={onLeaveModTeam}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Leave mod team
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ModeratorActionsPopover;
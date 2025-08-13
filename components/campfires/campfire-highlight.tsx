'use client';

import React from "react";
import CampfireFeedList from "@/components/campfires/campfire-feed-list";
import { Button } from "@/components/ui/button";
import { Pin, ChevronUp, ChevronDown } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface CampfireHighlightProps {
  campfireId: string;
  campfireName?: string;
  campfireIconUrl?: string;
}

const CampfireHighlight = ({ 
  campfireId, 
  campfireName, 
  campfireIconUrl 
}: CampfireHighlightProps) => {
  const [showHighlight, setShowHighlight] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex flex-col gap-1 items-center">
        <Button
          variant="ghost"
          size={"sm"}
          className={"rounded-full w-full items-center justify-between bg-none hover:bg-neutral-100 dark:hover:bg-neutral-800"}
          onClick={() => setShowHighlight(!showHighlight)}
        >
          <span className={"text-xs flex flex-row gap-1 text-neutral-500 dark:text-neutral-200"}>
            <span className={"rotate-45"}><Pin size={16} /></span>
            Community highlights
          </span>
          {showHighlight ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
        <div className={"flex flex-col items-center gap-2 w-full"}>
          {showHighlight && (
            <div className="border border-neutral-300 w-full h-16 hover:bg-neutral-50 dark:hover:bg-neutral-500 rounded-lg text-sm text-neutral-500 dark:text-neutral-300 px-4 flex items-center justify-center">
              <span className="text-center">Highlights coming soon...</span>
            </div>
          )}
          <Separator className="border dark:border-neutral-500" />
          <CampfireFeedList 
            campfireId={campfireId}
            campfireName={campfireName}
            campfireIconUrl={campfireIconUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default CampfireHighlight;
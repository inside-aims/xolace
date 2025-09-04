'use client';

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Book, ChevronRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import React from "react";

interface GuidePreview{
  campfireName: string;
  welcomeMsg: string;
  resource?: {label: string, value: string}[];
  icon?: string;
}
const GuidePreview = ({campfireName, welcomeMsg, resource, icon}: GuidePreview) => {
  return(
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col items-center text-center gap-2">
        <Avatar className="w-16 h-16 rounded-full ">
          <AvatarImage
            src={icon || ""}
            className="w-full h-full object-cover object-center rounded-full border"
          />
          <AvatarFallback className="bg-gradient-to-tr from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
            🔥
          </AvatarFallback>
        </Avatar>
        <h4 className="text-xl font-semibold">{campfireName}</h4>
      </div>

      <div className={"flex w-full items-start flex-col gap-1"}>
        <Alert className="rounded-xl bg-neutral-50 dark:bg-neutral-900">
          <AlertDescription className="flex flex-wrap items-center gap-1 text-sm">
            { welcomeMsg }
          </AlertDescription>
        </Alert>

        <div className="text-sm text-muted-foreground"> - Campfire Mod Team</div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <p className="font-medium">Resources</p>
        {resource && resource.map((item, i) => (
          <div
            key={`${item.label}-${i}`}
            className="w-full flex justify-between items-center text-sm text-muted-foreground"
          >
            <p className={"flex flex-row gap-1"}>
              <Book className={"w-4 h-4"}/>
              <span>{item.label}</span>
            </p>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        ))}

      </div>

      <Button className="rounded-full bg-lavender-500 hover:bg-lavender-600 text-white">
        Got It
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Access the campfire guide any time in the sidebar
      </p>
    </div>
  )
}
export default GuidePreview;
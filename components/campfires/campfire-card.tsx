import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import React from "react";
import {CampfirePurpose} from "@/components/campfires/campfires.types";
import Image from "next/image";
import Link from 'next/link';

interface CampfireCardProps {
  campfireId: string;
  name: string;
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
        return "bg-green-200 text-green-800";
      case CampfirePurpose.Growth:
        return "bg-orange-200 text-orange-800";
      case CampfirePurpose.Support:
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-neutral-200 text-neutral-800";
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


  return(
      <Card
        key={campfire.campfireId}
        className="h-full flex flex-col rounded-lg transition-shadow hover:shadow-lg dark:hover:shadow-[0_4px_14px_rgba(255,255,255,0.2)]"
      >
        <Link href={`/${campfire.name}`}>
          <CardHeader className="items-start">
            <div className="w-full flex items-start justify-between gap-4 ">
              <CardTitle className={"text-lg"}>{campfire.name}</CardTitle>
              {
                campfire.iconURL ? (
                  <Image
                    src={campfire.iconURL}
                    height={20}
                    width={20}
                    alt="CampfiresList icon"
                    className={`w-8 h-8 rounded-full border object-cover`}
                  />
                ) : (
                  <p className={`w-8 h-8 flex items-center justify-center border border-lavender-500 font-semibold text-white rounded-full`}>
                    <span className={`w-7 h-7 flex items-center justify-center bg-lavender-500 font-semibold text-white rounded-full`}>x/</span>
                  </p>
                )
              }
            </div>
            <CardDescription>{campfire.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge className={`${getBgSeverity(campfire.purpose)} font-normal`}>
              {`${campfire.purpose} circle`}
            </Badge>
          </CardContent>
        </Link>
        <CardFooter className="flex justify-between items-center mt-auto">
        <span className="text-sm text-muted-foreground">
          {formatMembers(campfire.members)} members
        </span>
          {!campfire.isMember && (
            <Button
              onClick={() =>  campfire.onJoin?.()}
              size="sm"
              className={"px-4 rounded-lg items-center bg-lavender-500 hover:bg-lavender-600 text-white"}
            >
              Join
            </Button>
          )}
        </CardFooter>
      </Card>
  )
}
export default CampfireCard;
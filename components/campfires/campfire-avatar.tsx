'use client';

import React from "react";
import Link from 'next/link';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {CampfireAvatarInterface} from "@/components/campfires/campfires.types";

const CampfireAvatar = ({avatarUrl, userRoute, username, assignedRole, title, signedUrls}: CampfireAvatarInterface) => {

   // 👇 This logic determines the correct avatar source
   const avatarSrc =
   (avatarUrl && signedUrls?.[avatarUrl]) || // Use signed URL if available
   avatarUrl || // Fallback to the original URL (for non-professionals)
   undefined; // Final fallback

  return(
    <div className={"flex flex-col items-start gap-4"}>
      {title && (
        <h2 className={"uppercase font-semibold"}>
          { title }
        </h2>
      )}
      <p className={"flex flex-row gap-2 items-center text-sm"}>
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={avatarSrc ?? undefined}
            className="w-full h-full object-cover object-center rounded-full border"
          />
          <AvatarFallback className="text-lg border border-neutral-300">
            {username?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className={"flex flex-row gap-x-2 gap-y-0 items-center flex-wrap break-all"}>
          {username && userRoute ? (
            <Link
              href={userRoute}
              className={"hover:underline"}>{username}
            </Link>
          ): (
            <span className={"text-sm text-neutral-300"}>{username}</span>
          )}
          <span
            className={"items-center bg-neutral-300 dark:bg-neutral-900 rounded-full capitalize text-xs px-2"}
          >
            { assignedRole }
          </span>
        </span>
      </p>
    </div>
  )
}
export default CampfireAvatar;
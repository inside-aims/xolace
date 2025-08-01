'use client';

import Image from "next/image";
import React from "react";
import { useAssignBadges } from "@/hooks/profile/useAssignBadges";
import { ChatBubblesSpinner } from "../shared/loaders/ChatBubbleSpinner";
import { usePostsCount } from "@/hooks/profile/usePostsCount";

interface StatsProps {
  reputation : number,
  userId: string
}

export function Stats({reputation, userId}: StatsProps) {
  const { data , isPending } = useAssignBadges(userId);

  const { data: count } = usePostsCount(userId);

  //Dummy profile stats for badges
  const profileStatBadges: {key: string, value: number, name: string, imageURL: string, className?: string}[] = [
    { key: "gold", value: data?.GOLD || 0, name: "Gold Badges", imageURL: "gold-medal", className: " hover:border-honey-600" },
    { key: "silver", value: data?.SILVER || 0, name: "Silver Badges", imageURL: "silver-medal", className: " hover:border-zinc-600" },
    { key: "bronze", value: data?.BRONZE || 0, name: "Bronze Badges", imageURL: "bronze-medal", className: " hover:border-yellow-800/50" },
  ]

  return(
    <div className={"mx-4 md:mx-0 pb-4"}>
      <div className={"w-full flex flex-col items-start gap-4 "}>
        <h3 className={"font-semibold text-xl hidden md:flex"}> Stats </h3>
        <div className="w-full grid grid-cols-12 items-stretch justify-between gap-4">
          <div
            className="col-span-12 md:col-span-3 p-4 shadow-lg rounded-lg flex flex-row md:flex-col gap-4 border">
            <p className="flex flex-col gap-0 m-0">
              <span>{count || 0}</span>
              <span>Posts</span>
            </p>
            <p className="flex flex-col">
              <span>{reputation}</span>
              <span>Reputation</span>
            </p>
          </div>

          {profileStatBadges.map((badge) => (
            <div
              key={badge.key}
              className={`col-span-12 md:col-span-3 p-4 shadow-lg rounded-lg flex flex-row md:flex-col gap-4 md:gap-8 border ${badge.className} `}
            >
              <p className="flex w-8 h-8 flex-col gap-0 m-0">
                <Image
                  src={`/assets/images/${badge.imageURL}.svg`}
                  alt={badge.name}
                  width={36}
                  height={36}
                  priority
                />
              </p>
              <div className="flex flex-col">
                {isPending ? (
                  <ChatBubblesSpinner size={30} className="mb-2" dotClassName=" bg-lavender-400"/>
                ) : (
                  <span>{badge.value}</span>
                )}
                <span>{badge.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
'use client';

import Image from "next/image";
import React from "react";

export function Stats() {

  //Dummy profile stats for badges
  const profileStatBadges: {key: string, value: number, name: string, imageURL: string}[] = [
    { key: "gold", value: 0, name: "Gold Badges", imageURL: "gold-medal" },
    { key: "silver", value: 0, name: "Silver Badges", imageURL: "silver-medal" },
    { key: "bronze", value: 0, name: "Bronze Badges", imageURL: "bronze-medal" },
  ]

  return(
    <div className={"mx-4 md:mx-0"}>
      <div className={"w-full flex flex-col items-start gap-4 "}>
        <h3 className={"font-semibold text-xl hidden md:flex"}> Stats </h3>
        <div className="w-full grid grid-cols-12 items-stretch justify-between gap-4">
          <div
            className="col-span-12 md:col-span-3 p-4 shadow-lg rounded-lg flex flex-row md:flex-col gap-4 border h-full">
            <p className="flex flex-col gap-0 m-0">
              <span>0</span>
              <span>Posts</span>
            </p>
            <p className="flex flex-col">
              <span>1</span>
              <span>Reactions</span>
            </p>
          </div>

          {profileStatBadges.map((badge) => (
            <div
              key={badge.key}
              className="col-span-12 md:col-span-3 p-4 shadow-lg rounded-lg flex flex-row md:flex-col gap-4 md:gap-8 border h-full"
            >
              <p className="flex w-8 h-8 flex-col gap-0 m-0">
                <Image
                  src={`/assets/images/${badge.imageURL}.svg`}
                  alt={badge.name}
                  width={36}
                  height={36}
                />
              </p>
              <p className="flex flex-col">
                <span>{badge.value}</span>
                <span>{badge.name}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
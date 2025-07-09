'use client';

import {NotificationProps} from "@/components/notifications/index";
import {useRouter} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import * as React from "react";

const NotificationCard = (props: NotificationProps) => {
  const router = useRouter();

  const truncate = (text: string, max = 30) => {
    return text.length > max ? text.slice(0, max) + '...' : text;
  };

  const handleCardClick = (type: string, typeId: string) => {
    if( type && type !== "system" ) {
      router.push(`/post/${typeId}`);
    } else {
      router.push(`/notifications/${typeId}`);
    }
  }

  return (
    <div className={`w-full flex flex-col border shadow-lg ${props.status == "unread" ? "bg-neutral-100 dark:bg-dark-2" : "bg-white dark:bg-[#121212]"}`}>
      <div
        key={props.notificationId}
        className="w-full p-4 flex items-start justify-between cursor-pointer"
        onClick={() => handleCardClick(props.type, props.type !== "system" ? props.typeId : props.notificationId)}
      >
        <div className="w-full flex flex-row gap-4 items-center justify-between" >
          <div className="w-full flex flex-row gap-4 items-start">
            <Avatar className="border border-neutral-300">
              <AvatarImage
                src={
                  props.type !== "system"
                    ? props.author_avatar_url
                    : "/assets/images/x-logo-full.webp"
                }
                alt={props.sender}
                className="object-cover"
              />
              <AvatarFallback>{props.sender.charAt(0)}</AvatarFallback>
            </Avatar>
            <div
              className={`w-full flex flex-col gap-2 hover:underline ${props.status === "read" ? 'text-neutral-400' : ''}`}>
              <div className={"flex flex-col"}>
              <span className="font-semibold">
                {props.sender}
              </span>
                <p className={"text-xs text-gray-400"}>
                  {new Date(props.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
              <span className="text-sm">
                {truncate(props.message)}
              </span>
            </div>
          </div>
          <p className={`lowercase text-sm ${props.status == 'read' && "text-neutral-400" }`}>{props.status}</p>
        </div>
      </div>
    </div>
  )
}
export default NotificationCard;
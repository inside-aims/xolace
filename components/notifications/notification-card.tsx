// /components/notifications/notification-card.tsx

'use client';

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@/types/global"; // Your main Notification type
import { useNotificationCardLogic } from "@/hooks/notifications/useNotificationCardLogic"; // The hook from our previous step
import { useMarkNotificationAsRead } from "@/hooks/notifications/useNotifications";

// This component now takes the full notification object as a prop
const NotificationCard = ({ notification }: { notification: Notification }) => {
  const router = useRouter();
const markNotificationAsRead = useMarkNotificationAsRead(notification);

  // Use the centralized hook to get the card's content
  const { icon, message, link } = useNotificationCardLogic(notification);

  const handleCardClick = () => {
    markNotificationAsRead.mutate();
    router.push(link);
  }

  return (
    <div
      onClick={handleCardClick}
      className={`w-full flex flex-col border-b last:border-b-0 cursor-pointer p-4 md:hover:scale-102 md:hover:shadow-md dark:md:hover:shadow-none md:hover:border-x-[1px] md:hover:border-neutral-300 dark:md:hover:border-neutral-700 transition-all ${!notification.is_read ? "bg-white dark:bg-black/40" : "bg-zinc-200/20 dark:bg-dark-2"}`}
    >
      <div className="w-full flex flex-row gap-4 items-center">
        <div className="relative">
          <Avatar className="h-10 w-10 border border-neutral-300">
            <AvatarImage src={notification.author_avatar_url || ''} alt={notification.author_name || 'Xolace Team'} />
            <AvatarFallback>{notification.author_name?.slice(0, 2).toUpperCase() || 'XO'}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-background p-0.5 rounded-full">{icon}</div>
        </div>
        <div className={`w-full flex flex-col ${notification.is_read ? 'text-muted-foreground' : ''}`}>
          <span className="text-sm">{message}</span>
          <p className="text-xs text-muted-foreground pt-1">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
        </div>
        {!notification.is_read && (
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500 self-center shrink-0"></div>
        )}
      </div>
    </div>
  );
}

export default NotificationCard;
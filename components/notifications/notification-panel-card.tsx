'use client';

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@/types/global";
import { useNotificationCardLogic } from "@/hooks/notifications/useNotificationCardLogic"; // Import the new hook
import { useMarkNotificationAsRead } from "@/hooks/notifications/useNotifications";

const NotificationPanelCard = (props: { notification: Notification }) => {
  const { notification } = props;
  const router = useRouter();
  const markNotificationAsRead = useMarkNotificationAsRead(notification);

  // 1. Get all the dynamic content from our custom hook
  const { icon, message, link } = useNotificationCardLogic(notification);

  // 2. Create a mutation to mark the notification as read
  // const markAsReadMutation = useMutation({
  //     mutationFn: async () => {
  //         if (!notification.is_read) {
  //             const { error } = await supabase.rpc('mark_notification_as_read', { notification_id: notification.id });
  //             if (error) throw new Error(error.message);
  //         }
  //     },
  //     onSuccess: () => {
  //         // Invalidate queries to update the UI (e.g., the unread count)
  //         queryClient.invalidateQueries({ queryKey: ['notifications'] });
  //     },
  //     // You can add onError for error handling if needed
  // });

  const handleCardClick = () => {
    markNotificationAsRead.mutate(); // Trigger the mutation
    router.push(link); // Navigate to the link
  }

  return (
    <div
      className={`w-full flex flex-col border-b ${notification.is_read ? "bg-neutral-100 dark:bg-dark-2" : "bg-white dark:bg-[#121212]"}`}
      onClick={handleCardClick}
    >
      <div
        key={notification.id}
        className="w-full p-4 flex items-start justify-between cursor-pointer"
      >
        <div className="w-full flex flex-row gap-4 items-start">
          {/* AVATAR & ICON */}
          <div className="relative">
            <Avatar className="border border-neutral-300">
              <AvatarImage
                src={notification.author_avatar_url || "/assets/images/x-logo-full.webp"}
                alt={notification.author_name}
                className="object-cover"
              />
              <AvatarFallback>{notification.author_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-background p-0.5 rounded-full">
                {icon}
            </div>
          </div>
          
          {/* CONTENT */}
          <div className={`w-full flex flex-col ${notification.is_read ? 'text-neutral-500' : 'text-foreground'}`}>
            <span className="text-sm">
              {message}
            </span>
            <p className="w-full text-xs text-gray-400 pt-1">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </p>
          </div>
          
          {/* UNREAD INDICATOR */}
          {!notification.is_read && (
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500 self-center shrink-0"></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationPanelCard;
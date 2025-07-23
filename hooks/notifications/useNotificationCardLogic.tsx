// /hooks/useNotificationCardLogic.ts

import { useMemo } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Bookmark, Eye, Bell, Heart } from 'lucide-react';
import type { Notification } from '@/types/global'; // Make sure this path is correct
import { truncateText } from '@/lib/utils';

export interface NotificationMetadataWithLink {
  link?: string; // link might be optional
  content?: string; // for new_comment
  title?: string; // for system_announcement
  // Add other properties you expect in metadata here
  [key: string]: any; // Allow other arbitrary properties
}

export function useNotificationCardLogic(notification: Notification) {
  // useMemo will prevent re-calculating this on every render unless the notification object changes.
  const cardContent = useMemo(() => {
    // Fallback link construction
    const getLink = () => {
      // Prioritize the link from metadata
      //console.log(notification.metadata);
      // Cast metadata to the expected type for safer access
      const metadata = notification.metadata as NotificationMetadataWithLink | null;
     
      // rather convert from json
      if (metadata?.link) {
        return metadata.link as string;
      }
      // Fallback to building the link from entity_id
      if (notification.entity_id) {
        if (notification.type.includes('video')) return `/glimpse/${notification.entity_id}`;
        if (notification.type.includes('post')) return `/post/${notification.entity_id}`;
      }
      // Final fallback for system announcements or notifications without a link
      return `/notifications/${notification.id}`;
    };
    
    const link = getLink();
    const actorName = <strong className="font-semibold">{notification.author_name}</strong>;

    // Cast metadata for content and title as well if they are used from metadata
    const metadataContent = (notification.metadata as NotificationMetadataWithLink | null)?.content;
    const metadataTitle = (notification.metadata as NotificationMetadataWithLink | null)?.title;
    const metadataDescription = (notification.metadata as NotificationMetadataWithLink | null)?.description;

    switch (notification.type) {
      case 'new_upvote':
        return {
          icon: <ThumbsUp className="h-5 w-5 text-green-500" />,
          message: <>{actorName} upvoted your post.</>,
          link,
        };
      case 'new_downvote':
        return {
          icon: <ThumbsDown className="h-5 w-5 text-red-500" />,
          message: <>{actorName} downvoted your post.</>,
          link,
        };
      case 'new_comment':
        return {
          icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
          message: <>{actorName} commented: "{`${truncateText(metadataContent || '', 30)}` || '...'}"</>,
          link,
        };
        case 'comment_reply':
        return {
          icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
          message: <>{actorName} replied your comment: "{`${truncateText(metadataContent || '', 30)}` || '...'}"</>,
          link,
        };
      case 'post_saved':
        return {
          icon: <Bookmark className="h-5 w-5 text-purple-500" />,
          message: <>{actorName} saved your post.</>,
          link,
        };
      case 'video_saved':
        return {
          icon: <Bookmark className="h-5 w-5 text-purple-500" />,
          message: <>{actorName} saved your video.</>,
          link,
        };
      case 'video_liked':
        return {
          icon: <Heart className="h-5 w-5 text-pink-500" />,
          message: <>{actorName} liked your video.</>,
          link,
        };
      case 'post_viewed':
          return {
              icon: <Eye className="h-5 w-5 text-gray-500" />,
              message: <>{actorName} viewed your post.</>,
              link,
          };
      case 'system_announcement': // for system notification add description
        return {
          icon: <Bell className="h-5 w-5 text-yellow-500" />,
          message: <>{metadataTitle || 'A new announcement from Xolace.'}</>,
          description: <>{metadataDescription || 'Check out the latest updates from Xolace.'}</>,
          link,
        };
      default:
        return {
          icon: <Bell className="h-5 w-5 text-gray-400" />,
          message: 'You have a new notification.',
          link: '#',
        };
    }
  }, [notification]);

  return cardContent;
}
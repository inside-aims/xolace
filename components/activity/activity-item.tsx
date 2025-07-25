import { formatDistanceToNow } from 'date-fns';
import { DbActivityLog } from '@/types/activity';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  ThumbsUp,
  Vote,
  FileText,
  Settings,
  Trash,
  Edit,
  Flag,
  View,
} from 'lucide-react';
import Link from 'next/link';

interface ActivityItemProps {
  log: DbActivityLog;
  viewType: 'my-activities' | 'related-to-me';
}

export function ActivityItem({ log, viewType }: ActivityItemProps) {
  const getActionIcon = () => {
    switch (log.action) {
      case 'created':
        return log.entity_type === 'post' ? (
          <FileText className="text-blue-500 h-5 w-5" />
        ) : (
          <MessageSquare className="h-5 w-5 text-green-500" />
        );
      case 'upvoted':
        return <ThumbsUp className="h-5 w-5 text-red-500" />;
      case 'commented':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'downvoted':
        return <Vote className="h-5 w-5 text-purple-500" />;
      case 'reported':
        return <Flag className="h-5 w-5 text-orange-500" />;
      case 'updated':
        return <Edit className="h-5 w-5 text-yellow-500" />;
      case 'deleted':
        return <Trash className="h-5 w-5 text-red-500" />;
      case 'viewed':
        return <View className="text-blue-500 h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActionText = () => {
    const userName =
      viewType === 'my-activities' ? 'You' : log.username;
    const entityPrefix = viewType === 'my-activities' ? 'a' : 'your';
    switch (log.action) {
      case 'created':
        return log.entity_type === 'post'
          ? `${userName} created a new post`
          : `${userName} created ${entityPrefix} ${log.entity_type}`;
      case 'added':
        return `${userName} added ${entityPrefix} ${log.entity_type} to ${log.metadata.collection_name}`;
      case 'upvoted':
        return `${userName} upvoted ${entityPrefix} post`;
      case 'commented':
        return `${userName} commented on ${entityPrefix} post`;
      case 'downvoted':
        return `${userName} downvoted ${entityPrefix} post`;
      case 'reported':
        return `${userName} reported ${entityPrefix} ${log.entity_type}`;
      case 'updated':
        return `${userName} updated your ${log.entity_type} ${log.metadata.new_username ? `username to ${log.metadata.new_username}` : ''}`;
      case 'deleted':
        return `${userName} deleted ${entityPrefix} ${log.entity_type}`;
      case 'viewed':
        return `${userName} viewed ${entityPrefix} post`;
      default:
        return `${userName} performed an action on ${entityPrefix} ${log.entity_type}`;
    }
  };

  const getRelatedText = () => {
    if (viewType === 'my-activities' && log.related_username) {
      return `Related to ${log.related_username}'s content`;
    } else if (viewType === 'related-to-me') {
      return 'On your content';
    }
    return null;
  };

  const getContentPreview = () => {
    if (log.metadata.content) {
      return log.metadata.content.length > 100
        ? `${log.metadata.content.substring(0, 100)}...`
        : log.metadata.content;
    }

    if (log.metadata.title) {
      return log.metadata.title;
    }

    return null;
  };

  const timeAgo = formatDistanceToNow(new Date(log.created_at), {
    addSuffix: true,
  });
  const contentPreview = getContentPreview();
  const relatedText = getRelatedText();

  return (
    <Card
      className={
        viewType === 'related-to-me' ? 'border-l-4 border-l-primary' : ''
      }
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="shrink-0">{getActionIcon()}</div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={log.user_avatar_url}
                    alt={log.username}
                  />
                  <AvatarFallback>
                    {log.username.substring(0, 2) || "XO"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{getActionText()}</span>
              </div>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>

            {contentPreview && (
              <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                {contentPreview}
              </div>
            )}

            {relatedText && (
              <div className="flex items-center gap-2">
                {viewType === 'my-activities' && log.related_user_id ? (
                  <>
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={log.related_user_avatar_url}
                        alt={log.related_username}
                      />
                      <AvatarFallback>
                        {log.related_username?.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Badge variant="outline" className="text-xs font-normal">
                      {relatedText}
                    </Badge>
                    {log.metadata?.link && (
                      <Link
                        href={log.metadata.link}
                        className="text-xs font-normal text-sky-400"
                      >
                        Visit
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {relatedText}
                    </Badge>
                    {log.metadata?.link && (
                      <Link
                        href={log.metadata.link}
                        className="text-xs font-normal text-sky-400"
                      >
                        Visit
                      </Link>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

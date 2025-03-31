import { formatDistanceToNow } from "date-fns";
import { DbActivityLog } from "@/types/activity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  ThumbsUp, 
  Vote, 
  AlertTriangle, 
  FileText, 
  User, 
  Settings,
  Trash,
  Edit,
  Flag,
  View
} from "lucide-react";

interface ActivityItemProps {
  log: DbActivityLog;
  viewType: "my-activities" | "related-to-me";
}

export function ActivityItem({ log, viewType }: ActivityItemProps) {
  const getActionIcon = () => {
    switch (log.action) {
      case "created":
        return log.entity_type === "post" ? <FileText className="h-5 w-5 text-blue-500" /> : <MessageSquare className="h-5 w-5 text-green-500" />;
      case "upvoted":
        return <ThumbsUp className="h-5 w-5 text-red-500" />;
      case "commented":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "downvoted":
        return <Vote className="h-5 w-5 text-purple-500" />;
      case "reported":
        return <Flag className="h-5 w-5 text-orange-500" />;
      case "updated":
        return <Edit className="h-5 w-5 text-yellow-500" />;
      case "deleted":
        return <Trash className="h-5 w-5 text-red-500" />;
      case "viewed":
        return <View className="h-5 w-5 text-blue-500" />;
      default:
        return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActionText = () => {
    // console.log("logs ", log)
    const userName = viewType === "my-activities" ? "You" : log.user_id?.username;
    console.log(" username -> ", userName)
    
    switch (log.action) {
      case "created":
        return log.entity_type === "post" 
          ? `${userName} created a new post` 
          : `${userName} created a ${log.entity_type}`;
      case "upvoted":
        return `${userName} liked a ${log.entity_type}`;
      case "commented":
        return `${userName} commented on a ${log.entity_type}`;
      case "downvoted":
        return `${userName} voted on a ${log.entity_type}`;
      case "reported":
        return `${userName} reported a ${log.entity_type}`;
      case "updated":
        return `${userName} updated a ${log.entity_type}`;
      case "deleted":
        return `${userName} deleted a ${log.entity_type}`;
      case "viewed":
        return `${userName} viewed a post`;
      default:
        return `${userName} performed an action on a ${log.entity_type}`;
    }
  };

  const getRelatedText = () => {
    if (viewType === "my-activities" && log.related_user_id?.username) {
      return `Related to ${log.related_user_id.username}'s content`;
    } else if (viewType === "related-to-me") {
      return "On your content";
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

  const timeAgo = formatDistanceToNow(new Date(log.created_at), { addSuffix: true });
  const contentPreview = getContentPreview();
  const relatedText = getRelatedText();

  return (
    <Card className={viewType === "related-to-me" ? "border-l-4 border-l-primary" : ""}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            {getActionIcon()}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={log.user_id?.avatar_url} alt={log.user_id?.username} />
                  <AvatarFallback>{log.user_id?.username.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{getActionText()}</span>
              </div>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
            
            {contentPreview && (
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {contentPreview}
              </div>
            )}
            
            {relatedText && (
              <div className="flex items-center gap-2">
                {viewType === "my-activities" && log.related_user_id ? (
                  <>
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={log.related_user_id.avatar_url} alt={log.related_user_id.username} />
                      <AvatarFallback>{log.related_user_id.username.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <Badge variant="outline" className="text-xs font-normal">
                      {relatedText}
                    </Badge>
                  </>
                ) : (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {relatedText}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
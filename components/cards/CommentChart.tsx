'use client';
import React from 'react';
import { NestedComment } from '@/types/global';
import CommentCard from "@/components/cards/CommentCard";
import { useCommentSignedUrls } from '@/hooks/storage/useCommentSignedUrl';

/*
{
    "name": "x/Best Of Anime",
    "slug": "best-of-anime",
    "icon_url": "http://127.0.0.1:54321/storage/v1/object/public/campfires.bucket/icons/4a39dece-d3f4-47f7-8bd5-e667e9c8c5d6_icon_1754846924934"
}
*/
interface CommentChartProps {
  comments: NestedComment[];
  onReply: (authorName: string, commentId: number) => void;
  replyingTo?: number | null;
  expandedComments: Set<number>;
  onToggleExpanded: (commentId: number) => void;
  postCreatedBy: string | null;
  campfires?: {
    name: string;
    slug: string;
    iconUrl?: string;
  } | null
}

const CommentChart: React.FC<CommentChartProps> = ({ comments, onReply, replyingTo, expandedComments, onToggleExpanded, postCreatedBy, campfires }) => {
  // const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  // const toggleExpanded = (commentId: number) => {
  //   const newExpanded = new Set(expandedComments);
  //   if (newExpanded.has(String(commentId))) {
  //     newExpanded.delete(String(commentId));
  //   } else {
  //     newExpanded.add(String(commentId));
  //   }
  //   setExpandedComments(newExpanded);
  // };

  // Group comments by parent_id to create the nested structure
  // const groupCommentsByParent = (comments: Comment[]) => {
  //   const commentMap = new Map<string, Comment[]>();
  //   const rootComments: Comment[] = [];

  //   // First pass: group all comments by their parent_id
  //   comments.forEach(comment => {
  //     if (!comment.parent_id) {
  //       rootComments.push(comment);
  //     } else {
  //       if (!commentMap.has(String(comment.parent_id))) {
  //         commentMap.set(String(comment.parent_id), []);
  //       }
  //       commentMap.get(String(comment.parent_id))!.push(comment);
  //     }
  //   });

  //   return { rootComments, commentMap };
  // };

  // const { rootComments, commentMap } = groupCommentsByParent(comments);

  // const renderComment = (comment: Comment, level: number = 0) => {
  //   const replies = commentMap.get(String(comment.id)) || [];

  //   return (
  //     <CommentCard
  //       key={comment.id}
  //       comment={comment}
  //       level={level}
  //       isExpanded={expandedComments.has(String(comment.id))}
  //       onToggleExpanded={toggleExpanded}
  //       replies={replies}
  //       onReply={onReply}
  //       replyingTo={replyingTo}
  //       className="bg-transparent px-0 py-0"

  //     />
  //   );
  // };

  const { data: commentSignedUrls } = useCommentSignedUrls(comments);
  return (
    <div className="space-y-2 ">
      {/* {rootComments.map((comment) => renderComment(comment, 0))} */}
      {comments.map(comment => (
                <CommentCard
                    key={comment.id}
                    comment={comment}
                    level={0} // Top-level comments are always level 0
                    onReply={onReply}
                    replyingTo={replyingTo}
                    isExpanded={expandedComments.has(comment.id)}
                    onToggleExpanded={onToggleExpanded}
                    expandedComments={expandedComments}
                    postCreatedBy={postCreatedBy}
                    campfires={campfires}
                    commentSignedUrls={commentSignedUrls}
                />
            ))}
    </div>
  );
};

export default CommentChart;
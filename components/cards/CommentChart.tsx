'use client';
import React, { useState } from 'react';
import { NestedComment } from '@/types/global';
import CommentCard from "@/components/cards/CommentCard";

interface CommentChartProps {
  comments: NestedComment[];
  onReply: (authorName: string, commentId: number) => void;
  replyingTo?: number | null;
  expandedComments: Set<number>;
  onToggleExpanded: (commentId: number) => void;
}

const CommentChart: React.FC<CommentChartProps> = ({ comments, onReply, replyingTo, expandedComments, onToggleExpanded }) => {
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
                />
            ))}
    </div>
  );
};

export default CommentChart;
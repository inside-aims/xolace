'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { format } from 'timeago.js';
import { ChevronDown, ChevronRight, Heart, MessageCircle, Share } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/types/global';
import { cn } from '@/lib/utils';
import PostDropdown from "@/components/shared/PostDropdown";
import KvngDialogDrawer from "@/components/shared/KvngDialogDrawer";
import ReportForm from "@/components/forms/ReportForm";
import { NestedComment } from '@/hooks/posts/use-comment-thread';

interface CommentCardProps {
  comment: NestedComment;
  level?: number;
  isExpanded: boolean;
  onToggleExpanded: (commentId: number) => void;
  onReply: (authorName: string, commentId: number) => void;
  replyingTo?: number | null;
  headerClassName?: string;
  contentClassName?: string;
  className?: string;
  expandedComments?: Set<number>;
}

const CommentCard = ({comment, className, headerClassName, contentClassName, level = 0, isExpanded = false, onToggleExpanded, onReply, replyingTo, expandedComments}: CommentCardProps) => {
  // states
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState('');

  const hasReplies = comment.replies && comment.replies.length > 0;
  const indentPadding = level * 24; // Reduced from 48 to 24 for better visual hierarchy
  const isBeingRepliedTo = replyingTo === comment.id;

  useEffect(() => {
    setTimestamp(format(comment.created_at));
  }, [comment]);

  return (
    <>
      {/* dialog or drawer to report comment */}
      <KvngDialogDrawer
        title="Report Comment"
        isDialogDrawerOpen={isOpen}
        setIsDialogDrawerOpen={setIsOpen}
      >
        <ReportForm commentId={comment.id} />
      </KvngDialogDrawer>

      <div className="relative w-full">
        {/* Connecting line for nested comments */}
        {level > 0 && (
          <div
            className="absolute top-0 w-0.5 bg-gray-300 dark:bg-gray-600"
            style={{
              left: `${indentPadding - 12}px`,
              height: hasReplies && isExpanded ? '100%' : '60px',
            }}
          />
        )}

        {/* Horizontal line connecting to parent */}
        {level > 0 && (
          <div
            className="absolute top-12 h-0.5 bg-gray-300 dark:bg-gray-600"
            style={{
              left: `${indentPadding - 12}px`,
              width: '12px',
            }}
          />
        )}

        <Card
          className={cn(
            "mb-2 w-full dark:bg-dark-3 hover:shadow-md transition-all duration-200 border-0",
            isBeingRepliedTo
              ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 dark:border-gray-700",
            className
          )}
        >
          <CardHeader 
            className={cn("flex-row items-start justify-between", headerClassName)}
            style={{ paddingLeft: `${16 + indentPadding}px` }}
          >
            <div className="flex items-center justify-center gap-1">
              <Avatar className='h-8 w-8'>
                <AvatarImage src={comment.author_avatar_url || undefined}/>
                <AvatarFallback className='bg-gradient-to-br from-[#0536ff] to-[#6a71ea] text-white'>
                  {comment.author_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start justify-center gap-1">
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
                  {comment.author_name}
                </h5>
              </div>
              <small className="ml-2 text-xs text-zinc-500 dark:text-gray-400">
                {timestamp}
              </small>
            </div>
            <PostDropdown
              postId={comment.post}
              comment={true}
              commentId={comment.id}
              commentCreatedBy={comment.created_by ?? ''}
              onOpenChange={setIsOpen}
              content={comment.comment_text}
            />
          </CardHeader>

          <CardContent 
            className={cn("mt-0", contentClassName)}
            style={{ paddingLeft: `${16 + indentPadding}px` }}
          >
            {(() => {
              const match = comment.comment_text.match(/^@(\w+)\s+(.*)/);
              if (match) {
                const username = match[1];
                const rest = match[2];
                return (
                  <p className="flex text-gray-800 dark:text-gray-200 leading-relaxed mb-2">
                    <span className="text-ocean-600 mr-1">@{username}</span>
                    <span>{rest}</span>
                  </p>
                );
              } else {
                return (
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-2">
                    {comment.comment_text}
                  </p>
                );
              }
            })()}

            {/* Comment Actions */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                <Heart className="w-4 h-4"/>
                <span className="text-sm">Like</span>
              </button>
              <button
                onClick={() => onReply?.(comment.author_name || 'User', comment.id)}
                className={cn(
                  "flex items-center space-x-1 transition-colors",
                  isBeingRepliedTo ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
                )}>
                <MessageCircle className="w-4 h-4"/>
                <span className="text-sm">Reply</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                <Share className="w-4 h-4"/>
                <span className="text-sm">Share</span>
              </button>
            </div>

            {/* Expand/Collapse Button for Replies */}
            {hasReplies && (
              <button 
                onClick={() => onToggleExpanded(comment.id)} 
                className="flex items-center space-x-1 mt-3 font-medium text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}
                <span>{isExpanded ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
              </button>
            )}
          </CardContent>
        </Card>

        {/* RECURSIVE RENDERING OF REPLIES */}
        {hasReplies && isExpanded && (
          <div className="space-y-2">
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                level={level + 1}
                isExpanded={expandedComments?.has(reply.id) ?? false}
                onReply={onReply}
                replyingTo={replyingTo}
                onToggleExpanded={onToggleExpanded}
                expandedComments={expandedComments}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CommentCard;
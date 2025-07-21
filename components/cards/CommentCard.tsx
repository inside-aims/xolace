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

interface CommentCardProps {
  comment: Comment;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  level?: number;
  isExpanded?: boolean;
  onToggleExpanded?: (commentId: number) => void;
  replies?: Comment[];
  onReply?: (authorName: string, commentId: number) => void;
  replyingTo?: string | null;
}

const CommentCard = ({comment, className, headerClassName, contentClassName, level = 0, isExpanded = false, onToggleExpanded, replies = [], onReply, replyingTo}: CommentCardProps) => {
  // states
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState('');

  const hasReplies = replies && replies.length > 0;
  const marginLeft = level * 48;
  const isBeingRepliedTo = replyingTo === String(comment.id);

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

      <div className="relative">
        {/* Connecting line for nested comments */}
        {level > 0 && (
          <div
            className="absolute top-0 w-0.5 bg-gray-300"
            style={{
              left: `${marginLeft - 24}px`,
              height: hasReplies && isExpanded ? '100%' : '60px',
            }}
          />
        )}

        {/* Horizontal line connecting to parent */}
        {level > 0 && (
          <div
            className="absolute top-12 h-0.5 bg-gray-300"
            style={{
              left: `${marginLeft - 24}px`,
              width: '24px',
            }}
          />
        )}

        <Card
          className={cn(
            "mb-5 w-full dark:bg-dark-3 md:w-full hover:shadow-md transition-all duration-200 border p-4",
            isBeingRepliedTo
              ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 dark:border-gray-700",
            className
          )}
          style={{ marginLeft: `${marginLeft}px` }}
        >
          <CardHeader className={cn("flex-row items-start justify-between", headerClassName)}>
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

          <CardContent className={cn("mt-0", contentClassName)}>
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
            {hasReplies && onToggleExpanded && (
              <button
                onClick={() => onToggleExpanded(comment.id)}
                className="flex items-center space-x-1 mt-3 font-medium text-sm transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4"/>
                ) : (
                  <ChevronRight className="w-4 h-4"/>
                )}
                <span>
                  {isExpanded ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                </span>
              </button>
            )}
          </CardContent>
        </Card>

        {/* Nested Replies */}
        {hasReplies && isExpanded && onToggleExpanded && (
          <div className="mt-4 space-y-4">
            {replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                level={level + 1}
                isExpanded={false}
                onReply={onReply}
                replyingTo={replyingTo}
                onToggleExpanded={onToggleExpanded}
                className="bg-transparent"
                headerClassName="px-0 py-0"
                contentClassName="pl-0 pb-0"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CommentCard;
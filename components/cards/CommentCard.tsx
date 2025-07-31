'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { format } from 'timeago.js';
import { ChevronDown, ChevronRight, MessageCircle, Pin } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import PostDropdown from '@/components/shared/PostDropdown';
import KvngDialogDrawer from '@/components/shared/KvngDialogDrawer';
import ReportForm from '@/components/forms/ReportForm';
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
  postCreatedBy: string | null;
}

const CommentCard = ({
  comment,
  className,
  headerClassName,
  contentClassName,
  level = 0,
  isExpanded = false,
  onToggleExpanded,
  onReply,
  replyingTo,
  expandedComments,
  postCreatedBy,
}: CommentCardProps) => {
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
            'mb-2 w-full border-0 transition-all duration-200',
            isBeingRepliedTo
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700',
            className,
          )}
        >
          <CardHeader
            className={cn(
              'flex-row items-start justify-between px-4 py-2',
              headerClassName,
            )}
            style={{ paddingLeft: `${16 + indentPadding}px` }}
          >
            <div className="flex items-center justify-center gap-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author_avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-[#0536ff] to-[#6a71ea] text-white">
                  {comment.author_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start justify-center gap-1">
                <h5 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
                  {comment.author_name}
                </h5>
              </div>
              <small className="ml-2 text-xs text-zinc-500 dark:text-gray-400">
                {timestamp}
              </small>
            </div>

            <div className="flex items-center gap-x-3">
              {comment.pinned_status !== 'none' && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Pin
                    className={`h-3 w-3 ${comment.pinned_status === 'professional' ? 'text-moss-600' : 'text-lavender-600'}`}
                  />
                  <span className="hidden sm:inline">
                    {comment.pinned_status === 'professional'
                      ? 'Pinned by a Professional'
                      : 'Pinned by Author'}
                  </span>
                </div>
              )}

              <PostDropdown
                postId={comment.post}
                comment={true}
                commentId={comment.id}
                commentCreatedBy={comment.created_by ?? ''}
                onOpenChange={setIsOpen}
                content={comment.comment_text}
                postCreatedBy={postCreatedBy ?? ''}
                commentPinnedStatus={comment.pinned_status}
              />
            </div>
          </CardHeader>

          <CardContent
            className={cn('mt-0', contentClassName)}
            style={{ paddingLeft: `${16 + indentPadding}px` }}
          >
            {(() => {
              const match = comment.comment_text.match(/^@(\w+)\s+(.*)/);
              if (match) {
                const username = match[1];
                const rest = match[2];
                return (
                  <p className="mb-2 leading-relaxed text-gray-800 dark:text-gray-200">
                    <span className="text-ocean-600 mr-1">@{username}</span>
                    <span>{rest}</span>
                  </p>
                );
              } else {
                return (
                  <p className="mb-2 leading-relaxed text-gray-800 dark:text-gray-200">
                    {comment.comment_text}
                  </p>
                );
              }
            })()}

            {/* Comment Actions */}
            <div className="flex items-center space-x-4">
              {/* <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                <Heart className="w-4 h-4"/>
                <span className="text-sm">Like</span>
              </button> */}
              <button
                onClick={() =>
                  onReply?.(comment.author_name || 'User', comment.id)
                }
                className={cn(
                  'flex items-center space-x-1 transition-colors',
                  isBeingRepliedTo
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-blue-600',
                )}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">Reply</span>
              </button>
              {/* <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                <Share className="w-4 h-4"/>
                <span className="text-sm">Share</span>
              </button> */}
            </div>

            {/* Expand/Collapse Button for Replies */}
            {hasReplies && (
              <button
                onClick={() => onToggleExpanded(comment.id)}
                className="mt-3 flex items-center space-x-1 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span>
                  {isExpanded ? 'Hide' : 'Show'} {comment.replies.length}{' '}
                  {comment.replies.length === 1 ? 'reply' : 'replies'}
                </span>
              </button>
            )}
          </CardContent>
        </Card>

        {/* RECURSIVE RENDERING OF REPLIES */}
        {hasReplies && isExpanded && (
          <div className="space-y-2">
            {comment.replies.map(reply => (
              <CommentCard
                key={reply.id}
                comment={reply}
                level={level + 1}
                isExpanded={expandedComments?.has(reply.id) ?? false}
                onReply={onReply}
                replyingTo={replyingTo}
                onToggleExpanded={onToggleExpanded}
                expandedComments={expandedComments}
                postCreatedBy={postCreatedBy ?? ''}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CommentCard;

'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { format } from 'timeago.js';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PostDropdown from '../shared/PostDropdown';
import ReportForm from '../forms/ReportForm';
import KvngDialogDrawer from '../shared/KvngDialogDrawer';
import { Comment } from '@/types/global';
import { cn } from '@/lib/utils';

const CommentCard = ({ comment, className, headerClassName, contentClassName }: {comment : Comment, className?: string, headerClassName?: string, contentClassName?: string}) => {
  // states
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState('');

  //
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

      <Card className={cn("mb-5 w-full dark:bg-dark-3 md:w-full  ", className)}>
        <CardHeader className={cn("flex-row items-start justify-between px-4 py-2", headerClassName)}>
          <div className="flex items-center justify-center gap-1">
            <Avatar className='h-8 w-8'>
              <AvatarImage src={comment.author_avatar_url || undefined}/>
              <AvatarFallback>XO</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center gap-1">
              <h5 className="text-sm text-default-400 tracking-tight">
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
        <CardContent className={cn("", contentClassName)}>{comment.comment_text}</CardContent>
      </Card>
    </>
  );
};

export default CommentCard;

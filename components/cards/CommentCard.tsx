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

const CommentCard = ({ comment }: {comment : Comment}) => {
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

      <Card className="mb-5 w-full dark:bg-dark-3 md:w-full">
        <CardHeader className="flex-row items-start justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={comment.author_avatar_url || undefined} />
              <AvatarFallback>XO</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-center gap-1">
              <h5 className="text-small text-default-400 tracking-tight">
                {comment.author_name}
              </h5>
            </div>
            <small className="ml-4 text-sm text-zinc-500 dark:text-gray-400">
              {timestamp}
            </small>
          </div>
          <PostDropdown
            postId={''}
            comment={true}
            commentId={comment.id}
            commentCreatedBy={comment.created_by}
            onOpenChange={setIsOpen}
          />
        </CardHeader>
        <CardContent className=" ">{comment.comment_text}</CardContent>
      </Card>
    </>
  );
};

export default CommentCard;

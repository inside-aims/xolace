'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { format } from 'timeago.js';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Clock, EyeIcon } from 'lucide-react';
import SaveToCollectionsButton from '../shared/SaveToCollectionsButton';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PostDropdown from '../shared/PostDropdown';
import PostMetrics from '../shared/PostMetrics';
import { useUserState } from '@/lib/store/user';
import ReportForm from '../forms/ReportForm';
import KvngDialogDrawer from '../shared/KvngDialogDrawer';
import { moodMap } from '@/types';
import { truncateText } from '@/lib/utils';
import TagCard from './TagCard';
import { Post } from '@/types/global';

type PostCardType = {
  className?: string;
  post: Post;
  section?: 'profile';
  onClick?: () => void;
};

export interface TagProps {
  tags: {
    name: string;
  };
}

export function PostCard({ className, post, onClick }: PostCardType) {
  // get user data
  const user = useUserState(state => state.user);

  // states
  const [timestamp, setTimestamp] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // get mood from mood object
  const mood = moodMap[post?.mood] || moodMap['neutral'];

  // convert created_at
  useEffect(() => {
    setTimestamp(format(post.created_at));
  }, [post]);

  const timeLeft = post.expires_at
    ? formatDistanceToNow(new Date(post.expires_at), {
        addSuffix: true,
      })
    : null;

  return (
    <>
      {/* dialog or drawer to report post */}
      <KvngDialogDrawer
        title="Report Post"
        isDialogDrawerOpen={isOpen}
        setIsDialogDrawerOpen={setIsOpen}
      >
        <ReportForm postId={post.id} />
      </KvngDialogDrawer>

      <Card
        className={className}
        id={post.id}
      >
        <CardHeader className="flex-row items-start justify-between px-4 py-2">
          <div className="flex items-center gap-3 md:gap-7">
            <Avatar>
              <AvatarImage src={post.author_avatar_url || undefined} alt={post.author_name} />
              <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-center">
              <h5 className="text-small text-default-400 tracking-tight">
                {post.author_name}
              </h5>
              <small className="text-[13px] text-zinc-500 dark:text-gray-400">
                {timestamp}
              </small>
            </div>
            {timeLeft && (
              <div className="flex items-center space-x-2">
                <Clock size={14} />
                <span className="text-[12px] text-muted-foreground">
                  {timeLeft}
                </span>
              </div>
            )}
          </div>
          <PostDropdown
            postCard
            postId={post.id}
            postCreatedBy={post.created_by}
            onOpenChange={setIsOpen}
          />
        </CardHeader>

        <CardContent className="cursor-pointer" onClick={onClick}>
          <div className="mb-2">
            {truncateText(post.content, 70)}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {post.posttags && // check if post has tags
              post.posttags.map((tag: TagProps, index: number) => (
                <TagCard
                  key={`${tag.tags.name}_${index}`}
                  name={tag.tags.name}
                  _id={`${tag.tags.name}_${index}`}
                />
              ))}
          </div>
        </CardContent>
        <CardFooter className="flex w-full items-center justify-between">
          <PostMetrics
            post={post}
            userId={user?.id || ''}
            votes={post.votes}
          />
          <div className="flex items-center gap-2" id='view-btn'>
            <EyeIcon className=" size-4 sm:size-6 text-red-200" />
            <span className=" text-sm sm:text-[15px]">{post.views[0].count}</span>
          </div>

          <div className='flex justify-center items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-3xl border p-1 dark:bg-transparent ${
              mood.style
            }`}
            id='mood-btn'
          >
            <span>
              {mood.gif ? (
                <Image
                  src={mood.gif}
                  alt="Gif Emoji"
                  width={24}
                  height={24}
                  className="h-6"
                  unoptimized
                />
              ) : (
                mood?.emoji
              )}
            </span>

            {post?.expires_in_24hr && (
              <span className="animate-bounce duration-700 ease-in-out">
                {' '}
                ⏳
              </span>
            )}
          </div>

          <div id='collection-btn'>
            <SaveToCollectionsButton userId={user?.id || ''} postId={post.id} postCollections={post.collections} />
          </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

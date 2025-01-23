'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { format } from 'timeago.js';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import PostDropdown from '../shared/PostDropdown';
import PostStats from '../shared/PostStats';
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
};

export interface TagProps {
  tags: {
    name: string;
  };
}

export function PostCard({ className, post }: PostCardType) {
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
        className={`mb-5 w-full ring-1 ring-white/[0.05] transition duration-300 dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47] md:w-full ${className}`}
        id={post.id}
      >
        <CardHeader className="flex-row items-start justify-between px-4 py-2">
          <div className="flex items-center gap-3 md:gap-7">
            <Avatar>
              <AvatarImage src={post.author_avatar_url || undefined} />
              <AvatarFallback>XO</AvatarFallback>
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

        <CardContent>
          <Link href={`post/${post.id}`} className="mb-2">
            {truncateText(post.content, 70)}
          </Link>
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
        <CardFooter className="flex items-center justify-between">
          <PostStats post={post} userId={user?.id || ''} />
          <div
            className={`flex items-center justify-center rounded-3xl border p-1 dark:bg-transparent ${
              mood.style
            }`}
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
        </CardFooter>
      </Card>
    </>
  );
}

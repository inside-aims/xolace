'use client';
import { useState } from 'react';
import Image from 'next/image';
import { format } from 'timeago.js';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PostDropdown from '../shared/PostDropdown';
import ReportForm from '../forms/ReportForm';
import { KvngSheet } from '../shared/KvngSheet';
import { moodMap } from '@/types';
import { DetailPost } from '@/types/global';
import TagCard from './TagCard';
import { TagProps } from './PostCard';

export function DetailCard({ postId, post }: { postId: string; post: DetailPost }) {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const postMood = moodMap[post?.mood] || moodMap['neutral'];

  const { created_at, content, author_name, author_avatar_url, created_by, posttags } =
    post;

  return (
    <>
      <Card className="mb-5 mt-5 w-full md:w-full">
        <CardHeader className="flex-row items-start justify-between px-4 py-2">
          <div className="flex items-center gap-2 md:gap-4">
            <Avatar>
              <AvatarImage src={author_avatar_url || undefined} />
              <AvatarFallback>XO</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-center gap-1">
              <h5 className="text-small text-default-400 tracking-tight">
                {author_name}
              </h5>
            </div>
            <small className="ml-4 text-sm text-zinc-500 dark:text-gray-400 md:ml-10">
              {format(created_at)}
            </small>
          </div>
          <PostDropdown
            postId={postId}
            postDetail={true}
            onOpenChange={setIsSheetOpen}
            postCreatedBy={created_by}
          />
        </CardHeader>
        <CardContent className="overflow-x-hidden !text-wrap">
          {content}

          <div className="mt-2 flex flex-wrap gap-2">
            {posttags && // check if post has tags
              posttags.map((tag: TagProps, index: number) => (
                <TagCard
                  key={`${tag.tags.name}_${index}`}
                  name={tag.tags.name}
                  _id={`${tag.tags.name}_${index}`}
                />
              ))}
          </div>
        </CardContent>
        <CardFooter>
          <div
            className={`flex items-center justify-center rounded-3xl border p-1 dark:bg-transparent ${
              postMood.style
            }`}
          >
            <span>
              {postMood.gif ? (
                <Image
                  src={postMood.gif}
                  alt="Gif Emoji"
                  width={24}
                  height={24}
                  className="h-6"
                />
              ) : (
                postMood.emoji
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
      <KvngSheet
        onOpenChange={setIsSheetOpen}
        open={isSheetOpen}
        title="Report Post"
        description="Let us know what you are having problems with"
        trigger={false}
      >
        <ReportForm postId={postId} />
      </KvngSheet>
    </>
  );
}

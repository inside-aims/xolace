'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'timeago.js';
import dynamic from 'next/dynamic';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
//import PostDropdown from '../shared/PostDropdown';
//import ReportForm from '../forms/ReportForm';
//import { KvngSheet } from '../shared/KvngSheet';
import { Button } from '@/components/ui/button';
import { DetailPost } from '@/types/global';
import TagCard from './TagCard';
import { TagProps } from './PostCard';
import SaveToCollectionsButton from '../shared/SaveToCollectionsButton';
import { useUserState } from '@/lib/store/user';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useSidebar } from '../ui/sidebar';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Dynamically import non-critical components
const PostDropdown = dynamic(() => import('../shared/PostDropdown'), {
  ssr: false,
});

const ReportForm = dynamic(() => import('../forms/ReportForm'), {
  ssr: false,
});

const KvngSheet = dynamic(
  () => import('../shared/KvngSheet').then(mod => mod.KvngSheet),
  {
    ssr: false,
  },
);

export function DetailCard({
  postId,
  post,
}: {
  postId: string;
  post: DetailPost;
}) {
  // const isDesktop = useMediaQuery('(min-width: 768px)');
  // const {setOpen } = useSidebar();

  // useEffect(() => {
  //   if (isDesktop) {
  //     setOpen(false);
  //   }
  // }, [isDesktop, setOpen]); // Runs when `isDesktop` changes

  // get user data
  const user = useUserState(state => state.user);

  const router = useRouter();

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  // const postMood = moodMap[post?.mood] || moodMap['neutral'];

  const {
    created_at,
    content,
    author_name,
    author_avatar_url,
    created_by,
    posttags,
  } = post;

  return (
    <>
      <Card className="mt-5 w-full rounded-none border-0 border-x-0 px-8 max-sm:mb-5 md:w-full">
        <CardHeader className="flex-row items-start justify-between px-6 py-2">
          <div className="flex items-center gap-2 md:gap-3">
            <button className="flex h-8 w-8 items-center justify-center rounded-full dark:bg-muted-dark bg-gray-700 cursor-pointer hover:bg-muted-dark-hover" onClick={() => router.back()}>
              <ArrowLeft size={22} />
            </button>
            <Avatar>
              <AvatarImage src={author_avatar_url || undefined} />
              <AvatarFallback>XO</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-center gap-1">
              <h5 className="text-small text-default-400 tracking-tight">
                {author_name}
              </h5>
            </div>
            <small className="ml-4 text-sm text-zinc-500 md:ml-10 dark:text-gray-400">
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
        <CardContent className="overflow-x-hidden text-wrap!">
          {content}

          <div className="mt-4 flex flex-wrap gap-2">
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
        {/* <CardFooter className='flex justify-between items-center'>
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
                  unoptimized
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
          
          <div>
            <SaveToCollectionsButton userId={user?.id || ''} createdBy={post.created_by} postId={post.id} postCollections={post.collections} />
          </div>
        </CardFooter> */}
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

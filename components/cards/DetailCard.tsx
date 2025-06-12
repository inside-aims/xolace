'use client';
import { useState } from 'react';
import { format, register, type LocaleFunc } from 'timeago.js';
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
import { DetailPost } from '@/types/global';
import TagCard from './TagCard';
import { TagProps } from './PostCard';
import SaveToCollectionsButton from '../shared/SaveToCollectionsButton';
import { useUserState } from '@/lib/store/user';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { moodColors, moodIcons } from '@/constants/moods';
import CarouselPost from '../shared/CarouselPost';
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

const View = dynamic(() => import('../hocs/detailsPostComponents/View'), {
  ssr: false,
});

// Define a custom locale
const customLocale: LocaleFunc = (
  number: number,
  index: number,
): [string, string] => {
  return [
    ['just now', 'right now'],
    ['%s sec ago', 'in %s sec'],
    ['1 min ago', 'in 1 min'],
    ['%s min ago', 'in %s min'],
    ['1 hr ago', 'in 1 hr'],
    ['%s hr ago', 'in %s hr'],
    ['1 day ago', 'in 1 day'],
    ['%s days ago', 'in %s days'],
    ['1 wk ago', 'in 1 wk'],
    ['%s wks ago', 'in %s wks'],
    ['1 mo ago', 'in 1 mo'],
    ['%s mos ago', 'in %s mos'],
    ['1 yr ago', 'in 1 yr'],
    ['%s yrs ago', 'in %s yrs'],
  ][index] as [string, string]; // This assertion ensures TypeScript understands it's a tuple
};

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
  // Register the custom locale with an ID (e.g. 'short-en')
  register('short-en', customLocale);

  const {
    created_at,
    content,
    author_name,
    author_avatar_url,
    created_by,
    posttags,
    mood,
    type,
    post_slides,
  } = post;
  console.log(post_slides);
  return (
    <>
      <Card className="mt-5 w-full rounded-none border-0 border-x-0 max-sm:mb-5 md:w-full md:px-8">
        <CardHeader className="flex-row items-start justify-between px-6 py-2">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              className="dark:bg-muted-dark hover:bg-muted-dark-hover flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-700 max-md:hidden"
              onClick={() => router.back()}
            >
              <ArrowLeft size={22} className="text-white" />
            </button>
            <Avatar>
              <AvatarImage
                src={author_avatar_url || undefined}
                className="max-sm:h-9 max-sm:w-9"
              />
              <AvatarFallback>XO</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-center gap-1">
                <h5 className="text-small text-default-400 tracking-tight">
                  {author_name}
                </h5>
                <div
                  className={`h-5 w-5 ${moodColors[mood]} flex items-center justify-center rounded-full text-white`}
                >
                  {moodIcons[mood]}
                </div>
              </div>
              <small className="text-sm text-zinc-500 dark:text-gray-400">
                {format(created_at, 'short-en')}
              </small>
            </div>
          </div>
          <PostDropdown
            postId={postId}
            postDetail={true}
            onOpenChange={setIsSheetOpen}
            postCreatedBy={created_by ?? ''}
          />
        </CardHeader>
        <CardContent className="overflow-x-hidden text-wrap!">
          {type === 'carousel' ? (
            <CarouselPost slides={post_slides} postId={postId} />
          ) : (
            content
          )}

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
        <CardFooter className="flex items-center justify-between md:hidden">
          <div className="flex items-center gap-3">
            {post?.expires_in_24hr && (
              <div
                className={`flex h-7 w-10 items-center justify-center rounded-full bg-zinc-400 dark:bg-zinc-700`}
              >
                <span className="animate-bounce duration-700 ease-in-out">
                  {' '}
                  ⏳
                </span>
              </div>
            )}
            <View
              id={post.id}
              createdBy={post.created_by ?? ''}
              viewsCount={post.views[0].count || 0}
              content={post.content}
            />
          </div>

          <div>
            <SaveToCollectionsButton
              userId={user?.id || ''}
              createdBy={post.created_by ?? ''}
              postId={post.id}
              postCollections={post.collections}
            />
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

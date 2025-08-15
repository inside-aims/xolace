'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { format } from 'timeago.js';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';
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
import { truncateText } from '@/lib/utils';
import TagCard from './TagCard';
import { Post } from '@/types/global';
import { usePreferencesStore } from '@/lib/store/preferences-store';
import PostCardMask from '../shared/masks/PostCardMask';
import { ScanEye } from 'lucide-react';
import { moodColors, moodIcons } from '@/constants/moods';
import { Badge } from '../ui/badge';
import FeedCarouselPost from '../shared/FeedCarouselPost';
import profBadge from '../../public/assets/images/user-role-badges/consellors-badge.webp';
import { SinglePost } from '../shared/SinglePost';
import Link from 'next/link';

interface CampfireOverride {
  name: string;
  iconUrl?: string | null;
  slug?: string;
}

type PostCardType = {
  className?: string;
  post: Post;
  section?: 'profile';
  onClick?: () => void;
  signedUrls?: Record<string, string>;
  campfireOverride?: CampfireOverride;
};

export interface TagProps {
  tags: {
    name: string;
  };
}

export function PostCard({
  className,
  post,
  onClick,
  signedUrls,
  campfireOverride,
}: PostCardType) {
  // get user data
  const user = useUserState(state => state.user);
  const { preferences } = usePreferencesStore();

  // states
  const [timestamp, setTimestamp] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // convert created_at
  useEffect(() => {
    setTimestamp(format(post.created_at));
  }, [post]);

  const timeLeft = post.expires_at
    ? formatDistanceToNow(new Date(post.expires_at), {
        addSuffix: true,
      })
    : null;

  //
  const isProfessional = post.author_roles.includes('help_professional');
  const isMentor = post.author_roles.includes('mentor');
  const isVerified = post.author_roles.includes('verified');

  // Determine display values (campfire override or original author)
  const displayName = campfireOverride?.name || post.author_name;

  // Avatar source logic with campfire support
  const avatarSrc =
    campfireOverride?.iconUrl ||
    (post.author_avatar_url && signedUrls?.[post.author_avatar_url]) ||
    post.author_avatar_url ||
    undefined;

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

      <Card className={`${className} relative`} id={post.id}>
        <CardHeader className="flex-row items-start justify-between px-4 py-2">
          <div className="flex items-center gap-2 md:gap-3">
            <Avatar>
              <AvatarImage src={avatarSrc} alt={displayName} />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-center gap-2">
                {campfireOverride ? (
                  <Link className='active:underline active:text-lavender-400' href={`/x/${campfireOverride.slug}`}>
                    {' '}
                    <h4 className="text-foreground font-semibold active:text-lavender-400">
                      {displayName}
                    </h4>
                  </Link>
                ) : (
                  <h4 className="text-foreground font-semibold">
                    {displayName}
                  </h4>
                )}

                <div
                  className={`h-5 w-5 ${moodColors[post.mood]} flex items-center justify-center rounded-full text-white`}
                >
                  {moodIcons[post.mood]}
                </div>
                <span className="text-xs">
                  {isProfessional && (
                    <Image
                      src={profBadge}
                      alt="professional badge"
                      width={20}
                      height={20}
                    />
                  )}
                </span>
              </div>

              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <small className="text-[13px] text-zinc-500 dark:text-gray-400">
                  {timestamp}
                </small>
                {isProfessional && (
                  <Badge
                    variant="minimal"
                    className="border-green-800/50 bg-green-900/90 py-[1px] text-[8px] text-green-400 dark:bg-green-900/20"
                  >
                    PROFESSIONAL
                  </Badge>
                )}
                {isMentor && (
                  <Badge
                    variant="minimal"
                    className="border-orange-800/50 bg-orange-900/90 py-[1px] text-[8px] text-orange-400 dark:bg-orange-900/20"
                  >
                    MENTOR
                  </Badge>
                )}
                {isVerified && (
                  <Badge
                    variant="minimal"
                    className="border-blue-800/50 bg-blue-900/90 py-[1px] text-[8px] text-blue-400 dark:bg-blue-900/20"
                  >
                    VERIFIED
                  </Badge>
                )}
                {campfireOverride && (
                  <Badge
                    variant="minimal"
                    className="border-purple-800/50 bg-purple-900/90 py-[1px] text-[8px] text-purple-400 dark:bg-purple-900/20"
                  >
                    CAMPFIRE
                  </Badge>
                )}
                {timeLeft && (
                  <Badge
                    variant="secondary"
                    className="hover:bg-secondary/50 py-[1px] text-[10px]"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    <span className="text-[10px]">{timeLeft}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <PostDropdown
            postCard
            postId={post.id}
            postCreatedBy={post.created_by ?? ''}
            onOpenChange={setIsOpen}
          />
        </CardHeader>

        <CardContent className="cursor-pointer">
          {post.type === 'single' ? (
            <SinglePost
              content={truncateText(post.content, 200)}
              onClick={onClick}
            />
          ) : (
            <FeedCarouselPost
              slides={post.post_slides || []}
              onClick={onClick}
              postId={post.id}
            />
          )}
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
          <PostMetrics post={post} userId={user?.id || ''} />
          <div className="flex items-center gap-2" id="view-btn">
            <ScanEye className="size-4 text-red-200 sm:size-4" />
            <span className="font-button-small">{post.views[0].count}</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            {post?.expires_in_24hr && (
              <div
                className={`flex h-6 w-8 items-center justify-center rounded-full bg-zinc-400 dark:bg-zinc-700`}
                id="mood-btn"
              >
                <span className="animate-bounce duration-700 ease-in-out">
                  {' '}
                  ⏳
                </span>
              </div>
            )}

            <div id="collection-btn">
              <SaveToCollectionsButton
                userId={user?.id || ''}
                createdBy={post.created_by ?? ''}
                postId={post.id}
                postCollections={post.collections}
              />
            </div>
          </div>
        </CardFooter>

        {post.is_sensitive &&
          !preferences?.show_sensitive_content &&
          post.created_by != user?.id && <PostCardMask />}
      </Card>
    </>
  );
}

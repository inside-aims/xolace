// Updated EnhancedPostCard component
'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { format, register, type LocaleFunc } from 'timeago.js';
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
import { usePreferencesStore } from '@/lib/store/preferences-store';
import PostCardMask from '../shared/masks/PostCardMask';
import {
  ScanEye,
  Smile,
  Zap,
  Brain,
  Coffee,
  Heart,
  Frown,
  Angry,
  Meh,
  Laugh,
  Star,
  Sun,
  Moon,
  CloudRain,
  Palette,
  Camera,
  Music,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { SinglePost } from '../shared/SinglePost';
import SimpleCarouselPost from '../shared/Tour/SimpleCorouselPost';
import profBadge from "../../public/assets/images/user-role-badges/consellors-badge.webp"
import { EnhancedPost } from '@/queries/posts/getEnhancedFeed';
import Link from 'next/link';

const moodIcons: Record<string, React.JSX.Element> = {
  happy: <Smile className="h-4 w-4" />,
  excited: <Zap className="h-4 w-4" />,
  thoughtful: <Brain className="h-4 w-4" />,
  chill: <Coffee className="h-4 w-4" />,
  grateful: <Heart className="h-4 w-4" />,
  sad: <Frown className="h-4 w-4" />,
  angry: <Angry className="h-4 w-4" />,
  neutral: <Meh className="h-4 w-4" />,
  laughing: <Laugh className="h-4 w-4" />,
  inspired: <Star className="h-4 w-4" />,
  energetic: <Sun className="h-4 w-4" />,
  peaceful: <Moon className="h-4 w-4" />,
  melancholy: <CloudRain className="h-4 w-4" />,
  creative: <Palette className="h-4 w-4" />,
  nostalgic: <Camera className="h-4 w-4" />,
  motivated: <Music className="h-4 w-4" />,
};

const moodColors: Record<string, string> = {
  happy: 'bg-yellow-400',
  excited: 'bg-orange-400',
  thoughtful: 'bg-purple-400',
  chill: 'bg-blue-400',
  grateful: 'bg-pink-400',
  sad: 'bg-slate-400',
  angry: 'bg-red-400',
  neutral: 'bg-gray-400',
  laughing: 'bg-emerald-400',
  inspired: 'bg-amber-400',
  energetic: 'bg-lime-400',
  peaceful: 'bg-indigo-400',
  melancholy: 'bg-cyan-400',
  creative: 'bg-violet-400',
  nostalgic: 'bg-rose-400',
  motivated: 'bg-teal-400',
};

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
  ][index] as [string, string];
};

interface CampfireOverride {
  name: string;
  iconUrl?: string | null;
  slug?: string;
}

type PostCardType = {
  className?: string;
  post: EnhancedPost;
  section?: 'profile';
  onClick?: () => void;
  signedUrls?: Record<string, string>;
  campfireOverride?: CampfireOverride; // New prop for campfire context
};

export interface TagProps {
  tags: {
    name: string;
  };
}

export function FeedEnhancedPostCard({ 
  className, 
  post, 
  onClick, 
  signedUrls, 
  campfireOverride 
}: PostCardType) {
  // Get user data
  const user = useUserState(state => state.user);
  const { preferences } = usePreferencesStore();

  // States
  const [timestamp, setTimestamp] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Register the custom locale
  register('short-en', customLocale);

  // Convert created_at
  useEffect(() => {
    setTimestamp(format(post.created_at, 'short-en'));
  }, [post.created_at]);

  const timeLeft = post.expires_at
    ? formatDistanceToNow(new Date(post.expires_at), {
        addSuffix: true,
      })
    : null;

  // Determine badge eligibility
  const isProfessional = post.author_roles.includes('help_professional');
  const isMentor = post.author_roles.includes('mentor');
  const isVerified = post.author_roles.includes('verified');

  // Determine display values (campfire override or original author)
  const displayName = post.campfire_name || post.author_name;
  // const displayAvatarUrl = campfireOverride?.iconUrl || post.author_avatar_url;
  
  // Avatar source logic with campfire support
  const avatarSrc = post.campfire_icon_url || 
    (post.author_avatar_url && signedUrls?.[post.author_avatar_url]) || 
    post.author_avatar_url || 
    undefined;

  // Generate fallback initials
  const fallbackInitials = campfireOverride 
    ? displayName.slice(0, 2).toUpperCase() 
    : post.author_name.slice(0, 2).toUpperCase();

  // Show original author info when in campfire context
  const showOriginalAuthor = !!campfireOverride;

  //post metric data
  const postMetricData = {
    id: post.id,
    comments: [
        {
            count: post.comments_count
        }
    ],
    created_by: post.created_by,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
  }

  return (
    <>
      {/* Dialog or drawer to report post */}
      <KvngDialogDrawer
        title="Report Post"
        isDialogDrawerOpen={isOpen}
        setIsDialogDrawerOpen={setIsOpen}
      >
        <ReportForm postId={post.id} />
      </KvngDialogDrawer>

      <Card className={`${className} relative hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]`} id={post.id}>
        <CardHeader className="flex-row items-start justify-between px-4 py-2">
          <div className="flex items-center gap-3 md:gap-7">
            <Avatar>
              <AvatarImage
                src={avatarSrc}
                alt={displayName}
              />
              <AvatarFallback className='bg-gradient-to-br from-[#0536ff] to-[#6a71ea] text-white'>
                {fallbackInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-center gap-2">
              {post.campfire_slug ? (
                  <Link className='active:underline active:text-lavender-400 ' href={`/x/${post.campfire_slug}`}>
                    {' '}
                    <h4 className="text-foreground font-semibold active:text-lavender-400 hover:text-lavender-400">
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
                  {isProfessional && !campfireOverride && (
                    <Image src={profBadge} alt="professional badge" width={20} height={20} />
                  )}
                </span>
              </div>

              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                {showOriginalAuthor && (
                  <small className="text-[11px] text-zinc-400 dark:text-gray-500">
                    by {post.author_name} • 
                  </small>
                )}
                <small className="text-[13px] text-zinc-500 dark:text-gray-400">
                  {timestamp}
                </small>
                {isProfessional && !campfireOverride && (
                  <Badge variant="minimal" className="text-[8px] py-[1px] text-green-400 bg-green-900/90 dark:bg-green-900/20 border-green-800/50">
                    PROFESSIONAL
                  </Badge>
                )}
                {isMentor && !campfireOverride && (
                  <Badge variant="minimal" className="text-[8px] py-[1px] text-orange-400 bg-orange-900/90 dark:bg-orange-900/20 border-orange-800/50">
                    MENTOR
                  </Badge>
                )}
                {isVerified && !campfireOverride && (
                  <Badge variant="minimal" className="text-[8px] py-[1px] text-blue-400 bg-blue-900/90 dark:bg-blue-900/20 border-blue-800/50">
                    VERIFIED
                  </Badge>
                )}
                {post.is_campfire_post && (
                  <Badge variant="minimal" className="text-[8px] py-[1px] text-purple-400 bg-purple-900/90 dark:bg-purple-900/20 border-purple-800/50">
                    CAMPFIRE
                  </Badge>
                )}
                {timeLeft && (
                  <Badge variant="secondary" className="text-[10px] py-[1px] hover:bg-secondary/50">
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
            postCreatedBy={post.created_by ?? ""}
            onOpenChange={setIsOpen}
          />
        </CardHeader>

        <CardContent className="cursor-pointer">
          {post.type === "single" ? (
            <SinglePost content={truncateText(post.content, 200)} onClick={onClick} />
          ) : (
            <SimpleCarouselPost slides={post.post_slides || []} onClick={onClick} />
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {post.posttags &&
              post.posttags.map((tag, index: number) => (
                <TagCard
                  key={`${tag.name}_${index}`}
                  name={tag.name}
                  _id={`${tag.name}_${index}`}
                />
              ))}
          </div>
        </CardContent>

        <CardFooter className="flex w-full items-center justify-between">
          <PostMetrics post={postMetricData} userId={user?.id || ''} />
          <div className="flex items-center gap-2" id="view-btn">
            <ScanEye className="size-4 text-red-200 sm:size-4" />
            <span className="font-button-small">{post.views_count}</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            {post?.expires_in_24hr && (
              <div
                className={`flex h-6 w-8 items-center justify-center rounded-full bg-zinc-400 dark:bg-zinc-700`}
                id="mood-btn"
              >
                <span className="animate-bounce duration-700 ease-in-out">
                  ⏳
                </span>
              </div>
            )}

            <div id="collection-btn">
              <SaveToCollectionsButton
                userId={user?.id || ''}
                createdBy={post.created_by ?? ""}
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
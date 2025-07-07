import React, { useState } from 'react';
import Image from 'next/image';
import { ShadowBtn } from '@/components/health-space/reflection/shadow-btn';
import { ThumbsUp, ScanEye, Bookmark, Copy, LinkIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SupaVideoDetails } from '@/types/global';
import { format } from 'timeago.js';
import { SaveVideoButton } from './save-video-button';
import { useUserState } from '@/lib/store/user';
import LikeVideoButton from './like-video-button';

const VideoMetadata = ({ video }: { video: SupaVideoDetails }) => {
  const { user } = useUserState();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/video/${video.video_id}`,
    );
    setCopied(true);
  };

  const isInitiallySaved = video.video_collections?.some(collection => collection.user_id === user?.id) || false;

  return (
    <section className="">
      <h1 className="mb-3 text-2xl font-semibold text-black dark:text-white md:text-3xl">
        {video.title}
      </h1>
      <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={video.author_name || '/placeholder.svg'}
              alt={video.author_name}
            />
            <AvatarFallback className="text-gray-600 dark:text-white">
              {video.author_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-black dark:text-white">
              {video.author_name}
            </p>
            <Badge
              variant={video.visibility === 'private' ? 'secondary' : 'outline'}
              className="mt-1 text-xs"
            >
              {video.visibility}
            </Badge>
          </div>
        </div>
        <div className="flex w-full items-start justify-between gap-0 md:w-auto md:gap-4">
         <LikeVideoButton videoId={video.id} userId={user?.id} likesCount={video.likes_count} bunny_video_id={video.video_id} createdBy={video.user_id}/>
          <ShadowBtn
            key={'view'}
            value={video.views}
            icon={<ScanEye className="size-4 text-red-200 sm:size-4" />}
          />
          <SaveVideoButton
            userId={user?.id}
            videoId={video.id}
            bunny_video_id={video.video_id}
            createdBy={video.user_id}
            isInitiallySaved={isInitiallySaved}
          />
          <button
            onClick={copyLink}
            className="flex h-8 w-8 items-center rounded-full border border-neutral-600 p-2"
          >
            {copied ? (
              <>
                <Image
                  src={'/assets/images/checked.png'}
                  alt="Copy Link"
                  width={24}
                  height={24}
                />
              </>
            ) : (
              <LinkIcon className="rotate-180 text-gray-500" />
            )}
          </button>
        </div>
      </div>
      <div className="text-gray-400 text-sm space-y-1 mt-4">
        <p>Uploaded {format(video.created_at)}</p>
        {video.description && <p className="text-gray-800 dark:text-gray-300 mt-1 leading-relaxed">{video.description}</p>}
      </div>
    </section>
  );
};

export default VideoMetadata;

'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Copy, Link as LinkIcon, ScanEye, ThumbsUp } from 'lucide-react';
import * as React from 'react';
import SaveToCollectionsButton from '@/components/shared/SaveToCollectionsButton';
import { VideoCardProps } from '@/components/health-space/reflection/index';
import { cleanTitle, createThumbnailLink } from '@/lib/utils';

const VideoCard = ({
  video_id,
  title,
  thumbnail_url,
  author_name,
  author_avatar_url,
  created_at,
  views,
  visibility,
  duration,
  likes_count,
}: VideoCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(`${window.location.origin}/${video_id}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  function formatDuration(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    } else {
      return `${pad(minutes)}:${pad(seconds)}`;
    }
  }

  return (
    <Link
      href={`/reflections/${video_id}`}
      className="relative flex w-full flex-col rounded-xl border shadow-lg"
    >
      <div className="relative flex flex-col">
        <Image
          src={thumbnail_url}
          width={250}
          height={100}
          alt="thumbnail"
          className="h-[250px] w-full rounded-t-xl"
          unoptimized
        />
        <div className={'absolute right-1 bottom-0 z-50 text-sm text-white'}>
          {duration !== null && <div>{formatDuration(duration) ?? 0}</div>}
        </div>
      </div>
      <article className={'flex w-full flex-col gap-2 p-4'}>
        <div className="flex w-full items-start justify-between">
          <figure className={'flex w-full flex-row gap-2'}>
            <div
              className={
                'flex h-[36px] w-[36px] items-start rounded-full border bg-neutral-300'
              }
            >
              {/*<Image*/}
              {/*  src={userImg}*/}
              {/*  width={36}*/}
              {/*  height={36}*/}
              {/*  alt="avatar"*/}
              {/*  className="rounded-full object-cover"*/}
              {/*/>*/}
            </div>

            <div className="m-0 flex flex-col items-start p-0 leading-none">
              <span>{author_name}</span>
              <span className="text-sm text-neutral-400">{visibility}</span>
            </div>
          </figure>
        </div>
        <h2 className={'text-lg font-semibold'}>
          {cleanTitle(title)} - {created_at}
        </h2>
        <div className={'flex flex-row items-center justify-between'}>
          <aside className={'flex items-center gap-4'}>
            <div className="flex items-center gap-1" id="likes">
              <ThumbsUp className="size-4 sm:size-4" />
              <span className="font-button-small">{likes_count}</span>
            </div>
            <div className="flex items-center gap-1" id="view-btn">
              <ScanEye className="size-4 text-red-200 sm:size-4" />
              <span className="font-button-small">{views}</span>
            </div>
          </aside>
          <div id="collection-btn">
            <SaveToCollectionsButton
              userId={''}
              createdBy={''}
              postId={video_id}
              postCollections={[]}
            />
          </div>
        </div>
      </article>
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-4">
        <button
          onClick={handleCopy}
          className="flex h-8 w-8 items-center rounded-full border border-neutral-600 p-2"
        >
          {copied ? (
            <Copy className="rotate-180 text-gray-500" />
          ) : (
            <LinkIcon className="rotate-180 text-gray-500" />
          )}
        </button>
      </div>
    </Link>
  );
};
export default VideoCard;

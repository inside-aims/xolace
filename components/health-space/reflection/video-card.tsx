'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useState} from "react";
import {Copy, Link as LinkIcon, ScanEye, ThumbsUp} from "lucide-react";
import * as React from "react";
import SaveToCollectionsButton from "@/components/shared/SaveToCollectionsButton";
import {VideoCardProps} from "@/components/health-space/reflection/index";
import {cleanTitle, createThumbnailLink} from "@/lib/utils";


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


  return(
    <Link href={`/reflections/${video_id}`} className="relative flex w-full flex-col shadow-lg rounded-xl border">
      <div className="relative flex flex-col">
        <Image
          src={thumbnail_url}
          width={250}
          height={100}
          alt="thumbnail"
          className="w-full h-[250px] rounded-t-xl"
          unoptimized
        />
        <div className={"absolute bottom-0 right-1 z-50 text-white text-sm"}>
          {duration !== null && (
            <div>{formatDuration(duration) ?? 0}</div>
          )}
        </div>
      </div>
      <article className={"flex w-full flex-col gap-2 p-4"}>
        <div className="w-full flex items-start justify-between">
          <figure className={"w-full flex flex-row gap-2"}>
            <div className={"flex items-start rounded-full h-[36px] w-[36px] border bg-neutral-300"}>
              {/*<Image*/}
              {/*  src={userImg}*/}
              {/*  width={36}*/}
              {/*  height={36}*/}
              {/*  alt="avatar"*/}
              {/*  className="rounded-full object-cover"*/}
              {/*/>*/}
            </div>

            <div className="flex flex-col items-start leading-none m-0 p-0">
              <span>{author_name}</span>
              <span className="text-sm text-neutral-400">
                {visibility}
              </span>
            </div>
          </figure>
        </div>
        <h2 className={"font-semibold text-lg"}>
          {cleanTitle(title)} - {" "}
          {created_at}
        </h2>
        <div className={"flex items-center flex-row justify-between"}>
          <aside className={"flex items-center gap-4"}>
            <div className="flex items-center gap-1" id="likes">
              <ThumbsUp className="size-4  sm:size-4"/>
              <span className="font-button-small">23</span>
            </div>
            <div className="flex items-center gap-1" id="view-btn">
              <ScanEye className="size-4 text-red-200 sm:size-4"/>
              <span className="font-button-small">{views}</span>
            </div>
          </aside>
          <div id="collection-btn">
            <SaveToCollectionsButton
              userId={''}
              createdBy={""}
              postId={video_id}
              postCollections={[]}
            />
          </div>
        </div>
      </article>
      <div className="absolute right-4 top-4 z-50 flex flex-col gap-4">
        <button onClick={handleCopy} className="flex items-center p-2 w-8 h-8 rounded-full border border-neutral-600">
          {copied ? (
            <Copy className="text-gray-500 rotate-180"/>
          ) : (
            <LinkIcon className="text-gray-500 rotate-180"/>
          )}
        </button>
      </div>
    </Link>
  )
}
export default VideoCard;
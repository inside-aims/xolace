'use server';

import { headers } from "next/headers";
import {revalidatePath} from "next/cache";
import {apiFetch, withErrorHandling} from "@/lib/utils";
import {BUNNY, BunnyVideoResponse, VideoDetails} from "@/components/health-space/reflection";

const API_KEY = process.env.BUNNY_API_KEY;
const LIBRARY_ID = process.env.BUNNY_EMBED_LIBRARY_ID;
const BUNNY_STREAM_ACCESS_KEY = process.env.BUNNY_STREAM_ACCESS_KEY;
const BUNNY_STORAGE_ACCESS_KEY= process.env.BUNNY_STORAGE_ACCESS_KEY;
const HOST_NAME = process.env.BUNNY_HOST_NAME;


const VIDEO_STREAM_BASE_URL = BUNNY.STREAM_BASE_URL;
const THUMBNAIL_STORAGE_BASE_URL = BUNNY.STORAGE_BASE_URL;
const THUMBNAIL_CDN_URL = BUNNY.CDN_URL;

const ACCESS_KEYS = {
  streamAccessKey: `${BUNNY_STREAM_ACCESS_KEY}`,
  storageAccessKey: `${BUNNY_STORAGE_ACCESS_KEY}`,
};

// Helper functions with descriptive names
const revalidatePaths = (paths: string[]) => {
  paths.forEach((path) => revalidatePath(path));
};


// get all videos
export async function fetchBunnyVideos() {
  const res = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
    headers: {
      AccessKey: BUNNY_STREAM_ACCESS_KEY!,
    },
    cache: 'no-store',
  });

  console.log("res ", res);
  if (!res.ok) throw new Error("Failed to fetch Bunny videos");
  return await res.json();
}

// get single video by ID
export async function fetchBunnyVideoById(videoId: string) {
  const res = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`, {
    headers: {
      AccessKey: BUNNY_STREAM_ACCESS_KEY!,
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch Bunny video with ID: ${videoId}`);
  return await res.json();
}




export const getVideoUploadUrl = withErrorHandling(async () => {
  const videoResponse = await apiFetch<BunnyVideoResponse>(
    `${VIDEO_STREAM_BASE_URL}/${LIBRARY_ID}/videos`,
    {
      method: "POST",
      bunnyType: "stream",
      body: { title: "Temp Title", collectionId: "" },
    }
  );

  const uploadUrl = `${VIDEO_STREAM_BASE_URL}/${LIBRARY_ID}/videos/${videoResponse.guid}`;
  return {
    videoId: videoResponse.guid,
    uploadUrl,
    accessKey: ACCESS_KEYS.streamAccessKey,
  };
});

export const getThumbnailUploadUrl = withErrorHandling(
  async (videoId: string) => {
    const timestampedFileName = `${Date.now()}-${videoId}-thumbnail`;
    const uploadUrl = `${THUMBNAIL_STORAGE_BASE_URL}/thumbnails/${timestampedFileName}`;
    const cdnUrl = `${THUMBNAIL_CDN_URL}/thumbnails/${timestampedFileName}`;

    return {
      uploadUrl,
      cdnUrl,
      accessKey: ACCESS_KEYS.storageAccessKey,
    };
  }
);

export const saveVideoDetails = withErrorHandling(
  async (videoDetails: VideoDetails) => {
    await apiFetch(
      `${VIDEO_STREAM_BASE_URL}/${LIBRARY_ID}/videos/${videoDetails.videoId}`,
      {
        method: "POST",
        bunnyType: "stream",
        body: {
          title: videoDetails.title,
          description: videoDetails.description,
        },
      }
    );

    const now = new Date();
    // await db.insert(videos).values({
    //   ...videoDetails,
    //   videoUrl: `${BUNNY.EMBED_URL}/${LIBRARY_ID}/${videoDetails.videoId}`,
    //   userId,
    //   createdAt: now,
    //   updatedAt: now,
    // });

    revalidatePaths(["/"]);
    return { videoId: videoDetails.videoId };
  }
);


'use server';

import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import {apiFetch, withErrorHandling} from "@/lib/utils";
import {BUNNY, BunnyVideoResponse, VideoDetails} from "@/components/health-space/reflection";
import {getEnv} from "@/lib/utils";

const LIBRARY_ID = getEnv("BUNNY_EMBED_LIBRARY_ID");
//const HOST_NAME = getEnv("BUNNY_HOST_NAME");


const VIDEO_STREAM_BASE_URL = BUNNY.STREAM_BASE_URL;
const THUMBNAIL_STORAGE_BASE_URL = BUNNY.STORAGE_BASE_URL;
const THUMBNAIL_CDN_URL = BUNNY.CDN_URL;

const ACCESS_KEYS = {
  streamAccessKey: getEnv("BUNNY_STREAM_ACCESS_KEY"),
  storageAccessKey: getEnv("BUNNY_STORAGE_ACCESS_KEY"),
};

// Helper functions with descriptive names
// const revalidatePaths = (paths: string[]) => {
//   paths.forEach((path) => revalidatePath(path));
// };


const getSessionUserId = async () => {
  const supabase = await createClient();
  // supabase user session
  const { data: { user } ,error } = await supabase.auth.getUser();
  if (!user || error) throw new Error("Unauthenticated")
  return user?.id;
};



// Server Actions 
// get all videos
export async function fetchBunnyVideos() {
  const res = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
    headers: {
      AccessKey: ACCESS_KEYS.streamAccessKey!,
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error("Failed to fetch Bunny videos");
  return await res.json();
}

// get single video by ID
export async function fetchBunnyVideoById(videoId: string) {
  const res = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`, {
    headers: {
      AccessKey: ACCESS_KEYS.streamAccessKey!,
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch Bunny video with ID: ${videoId}`);
  return await res.json();
}




export const getVideoUploadUrl = withErrorHandling(async () => {
  await getSessionUserId();
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
    const supabase = await createClient();
    await getSessionUserId();
    await apiFetch(
      `${VIDEO_STREAM_BASE_URL}/${LIBRARY_ID}/videos/${videoDetails.video_id}`,
      {
        method: "POST",
        bunnyType: "stream",
        body: {
          title: videoDetails.title,
          description: videoDetails.description,
        },
      }
    );

    const { error } = await supabase
      .from("videos")
      .insert({
        ...videoDetails,
        video_url: `${BUNNY.EMBED_URL}/${LIBRARY_ID}/${videoDetails.video_id}`,
      })
      .select("video_id")
      .single();

    if (error) {
      console.error("Error inserting video into Supabase:", error);
      throw error;
    }

    return { videoId: videoDetails.video_id };
  }
);


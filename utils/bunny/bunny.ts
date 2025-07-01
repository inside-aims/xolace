const API_KEY = process.env.BUNNY_API_KEY;
const LIBRARY_ID = process.env.BUNNY_EMBED_LIBRARY_ID;
const HOST_NAME = process.env.BUNNY_HOST_NAME;
const STREAM_ACCESS_KEY = process.env.BUNNY_STREAM_ACCESS_KEY;

console.log("API_KEY ", API_KEY)

export const cleanTitle = (title: string) => {
  return title.replace(/\.[^/.]+$/, '');
}

export function createIframeLink(videoId: string, startTime?: number) {
  let base = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}?autoplay=true&preload=true`;

  if (startTime && startTime > 0) {
    base += `&start=${startTime}`;
  }

  return base;
}


// default thumbnail URL
export const createThumbnailLink = (videoId: string, thumbnailFileName: string) => {
  return `https://${HOST_NAME}/${videoId}/${thumbnailFileName}`;
};

// get all videos
export async function fetchBunnyVideos() {
  const res = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
    headers: {
      AccessKey: STREAM_ACCESS_KEY!,
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
      AccessKey: STREAM_ACCESS_KEY!,
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch Bunny video with ID: ${videoId}`);
  return await res.json();
}

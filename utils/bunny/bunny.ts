const API_KEY = process.env.BUNNY_PUBLIC_API_KEY;
const LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNY_EMBED_LIBRARY_ID;
const HOST_NAME = process.env.NEXT_PUBLIC_BUNNY_HOST_NAME;

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
      AccessKey: API_KEY!,
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
      AccessKey: API_KEY!,
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch Bunny video with ID: ${videoId}`);
  return await res.json();
}

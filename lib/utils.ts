import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PostDuration } from '@/types';
import {ApiFetchOptions} from "@/components/health-space/reflection";

const BUNNY_STREAM_ACCESS_KEY = process.env.BUNNY_STREAM_ACCESS_KEY;
const  BUNNY_STORAGE_ACCESS_KEY= process.env.BUNNY_STORAGE_ACCESS_KEY;
// const HOST_NAME = process.env.BUNNY_HOST_NAME;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

export const generateRandomNumber = ({
  min,
  max,
}: {
  min: number;
  max: number;
}) => {
  const generatedNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return generatedNumber;
};

// post related utilities
export const truncateText = (text: string, limit: number) => {
  if (text.length > limit) {
    return text.substring(0, limit) + ' ...';
  }
  return text;
};

export const calculateExpiryDate = (duration: PostDuration): string => {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + duration);
  return expiryDate.toISOString();
};

export const removeHashtags = (text: string): string => {
  return text.replace(/#\w+\s?/g, '').trim();
};

// Fisher-Yates shuffle algorithm
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Seeded random number generator
export const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Seeded shuffle that produces the same order for the same seed
export const seededShuffleArray = <T>(array: T[], seed: number): T[] => {
  const arrayCopy = [...array];
  let currentIndex = arrayCopy.length;
  let randomIndex;

  // Generate a seed based on the current day to keep the order stable for 24 hours
  while (currentIndex !== 0) {
    randomIndex = Math.floor(seededRandom(seed + currentIndex) * currentIndex);
    currentIndex--;

    [arrayCopy[currentIndex], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex],
      arrayCopy[currentIndex],
    ];
  }

  return arrayCopy;
};


/**
 * Generates a slug from a given title.
 * @param {string} title - The title to generate a slug from.
 * @returns {string} The generated slug.
 */
export function generateSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export function generateCampfireSlug(text: string) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    // Replace accented characters (e.g., é → e)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    // Replace spaces & underscores with hyphens
    .replace(/[\s_]+/g, "-")
    // Remove invalid chars (anything not a-z, 0-9, or hyphen)
    .replace(/[^a-z0-9-]/g, "")
    // Remove multiple hyphens
    .replace(/-+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "");
}



// Get env helper function
export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env: ${key}`);
  return value;
};

export function createIframeLink(videoId: string, startTime?: number) {
  let base = `https://iframe.mediadelivery.net/embed/468693/${videoId}?autoplay=true&preload=true`;

  if (startTime && startTime > 0) {
    base += `&start=${startTime}`;
  }

  return base;
}

// default thumbnail URL
export const createThumbnailLink =  (videoId: string, thumbnailFileName: string) => {
  return `https://storage.bunnycdn.com/${videoId}/${thumbnailFileName}`;
};

// API fetch helper with required Bunny CDN options
export const apiFetch = async <T = Record<string, unknown>>(
  url: string,
  options: Omit<ApiFetchOptions, "bunnyType"> & {
    bunnyType: "stream" | "storage";
  }
): Promise<T> => {
  const {
    method = "GET",
    headers = {},
    body,
    expectJson = true,
    bunnyType,
  } = options;

  const key = (
    bunnyType === "stream"
      ? `${BUNNY_STREAM_ACCESS_KEY}`
      :`${BUNNY_STORAGE_ACCESS_KEY}`
  );

  const requestHeaders = {
    ...headers,
    AccessKey: key,
    ...(bunnyType === "stream" && {
      accept: "application/json",
      ...(body && { "content-type": "application/json" }),
    }),
  };

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`API error ${response.text()}`);
  }

  if (method === "DELETE" || !expectJson) {
    return true as T;
  }

  return await response.json();
};


export const cleanTitle = async (title: string) => {
  return title.replace(/\.[^/.]+$/, '');
}

// Higher order function to handle errors
export const withErrorHandling = <T, A extends unknown[]>(
  fn: (...args: A) => Promise<T>
) => {
  return async (...args: A): Promise<T> => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return errorMessage as unknown as T;
    }
  };
};
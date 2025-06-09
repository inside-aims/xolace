import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PostDuration } from '@/types';

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
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
export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

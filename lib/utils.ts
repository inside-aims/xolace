import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PostDuration } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  // return likeList.some((like) => {
  //   console.log("Checks -> ", like.user_id, userId, like.id);
  //   return like.user_id === userId;
  // });
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
    return text.substring(0, limit) + " ...";
  }
  return text;
};

export const calculateExpiryDate = (duration: PostDuration): string => {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + duration);
  return expiryDate.toISOString();
};

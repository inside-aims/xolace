import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkIsLiked = (
  likeList: { id: number; user_id: string }[],
  userId: string
) => {
  return likeList.some((like) => like.user_id === userId);
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

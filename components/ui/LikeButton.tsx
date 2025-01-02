"use client";

import React, { useState, useEffect } from "react";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { checkIsLiked } from "@/lib/utils";
import { toggleLikePost } from "@/utils/helpers/toggleLikePost";
import { useUserState } from "@/lib/store/user";

const LikeButton = ({ postId, likes, setLikes }: any) => {
  const user = useUserState((state) => state.user);
  console.log("State user ", user);

  console.log("initial-> ", likes, postId);

  const [isLiked, setIsLiked] = useState(false);
  console.log("bool -> ", isLiked);

  // Update `isLiked` whenever `likes` or `user?.id` changes
  useEffect(() => {
    if (user?.id) {
      const checks = checkIsLiked(likes, user.id);
      setIsLiked(checks);
    }
  }, [likes, user?.id]);

  //   function to handle button clicks
  const handleLikePost = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Toggle the like status & add or delete within the database
    await toggleLikePost(postId, isLiked, user?.id);
    setIsLiked(!isLiked);
  };
  return (
    <>
      <p
        className="font-semibold text-default-400 text-small cursor-pointer"
        onClick={handleLikePost}
      >
        {isLiked ? (
          <HeartFilledIcon className="transition-all ease-in-out duration-300 w-[24px] h-[24px] dark:text-[#2e4ea7] text-[#b42d24]" />
        ) : (
          <HeartIcon className="transition-all ease-in-out duration-300 w-[24px] h-[24px] dark:text-[#f3f3f3] text-[#000000]" />
        )}
      </p>
    </>
  );
};

export default LikeButton;

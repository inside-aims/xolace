'use client';

import React, { useState, useEffect } from 'react';
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';
import { checkIsLiked } from '@/lib/utils';
import { toggleLikePost } from '@/utils/helpers/toggleLikePost';
import { useUserState } from '@/lib/store/user';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LikeButton = ({ postId, likes }: any) => {
  const user = useUserState(state => state.user);

  const [isLiked, setIsLiked] = useState(false);

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
        className="text-default-400 text-small cursor-pointer font-semibold"
        onClick={handleLikePost}
      >
        {isLiked ? (
          <HeartFilledIcon className="h-[24px] w-[24px] text-[#b42d24] transition-all duration-300 ease-in-out dark:text-[#2e4ea7]" />
        ) : (
          <HeartIcon className="h-[24px] w-[24px] text-[#000000] transition-all duration-300 ease-in-out dark:text-[#f3f3f3]" />
        )}
      </p>
    </>
  );
};

export default LikeButton;

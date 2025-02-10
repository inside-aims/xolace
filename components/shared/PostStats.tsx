/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { HeartIcon, HeartFilledIcon } from '@radix-ui/react-icons';
import { toggleLikePost } from '@/utils/helpers/toggleLikePost';
import { checkIsLiked } from '@/lib/utils';
import Link from 'next/link';

interface postStatProps {
  post: any;
  section?: string;
  commentLength?: number;
  userId: string;
}

const PostStats = ({
  post,
  section = 'post',
  commentLength,
  userId,
}: postStatProps) => {
  const postLikesList = post.likes.map((like: any) => like.user_id);
  // Set local state for likes
  const [likesList, setLikesList] = useState(postLikesList || []);
  const [isLiked, setIsLiked] = useState(checkIsLiked(likesList || [], userId));

  // Handle like button click (with debounce)
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    let newLikes = [...likesList];
    const hasLiked = newLikes.includes(userId);

    if (hasLiked) {
      newLikes = newLikes.filter(id => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikesList(newLikes);
    setIsLiked(!isLiked);
    await toggleLikePost(post.id, isLiked, userId);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex w-12 min-w-12 max-w-12 items-center">
        <button type="button" onClick={handleLike}>
          {isLiked ? (
            <HeartFilledIcon className="h-[24px] w-[24px] text-[#b42d24] transition-all duration-300 ease-in-out dark:text-[#2e4ea7]" />
          ) : (
            <HeartIcon className="h-[24px] w-[24px] text-gray-500 transition-all duration-300 ease-in-out" />
          )}
        </button>
        <span>{likesList.length}</span>
      </div>
      <div className="flex items-center gap-1">
        {section === 'details' ? (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 -scale-x-100 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        ) : (
          <Link
            href={`post/${post.id}?type=comment`}
            className="text-default-400 text-small font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 -scale-x-100 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </Link>
        )}
        <p className="text-default-400 text-small">
          {section === 'details' ? commentLength : post?.comments[0].count}
        </p>
      </div>
    </div>
  );
};

export default PostStats;

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
//import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DetailPost, Post, PostMetricData } from '@/types/global';
import { AnimatePresence, motion } from 'motion/react';
import { useUserVote } from '@/hooks/posts/useUserVote';
import { useVoteMutations } from '@/hooks/posts/useVoteMutation';

interface PostMetricsProps {
  post: Post | DetailPost | PostMetricData;
  section?: string;
  commentLength?: number;
  userId: string;
  votes?: { user_id: string | null; vote_type: string }[];
}

const PostMetrics = ({
  post,
  section = 'post',
  commentLength,
  userId,
}: PostMetricsProps) => {
  const router = useRouter();
  const { mutateVote, isLoading: isVoting, isError } = useVoteMutations();
  const { data: userVote, isPending, isSuccess} = useUserVote(post.id, userId);

  // Get the current user's vote if it exists
  //const userVote = votes.find(vote => vote.user_id === userId)?.vote_type || null;

  const [currentVote, setCurrentVote] = useState<"upvote" | "downvote" | null | undefined>(userVote);
  // const [upvoteCount, setUpvoteCount] = useState(post.upvotes);
  // const [downvoteCount, setDownvoteCount] = useState(post.downvotes);
  //const [isVoting, setIsVoting] = useState(false);

  // Initialize vote state only once when component mounts
  // useEffect(() => {
  //   const userVote =
  //     votes.find(vote => vote.user_id === userId)?.vote_type || null;
  //   setCurrentVote(userVote);
  // }, [userId]); // Only run when userId changes

  useEffect(() => {
      setCurrentVote(userVote);
    }, [userVote]);

  // Update counts from props without affecting currentVote
  // useEffect(() => {
  //   setUpvoteCount(post.upvotes);
  //   setDownvoteCount(post.downvotes);
  // }, [post.upvotes, post.downvotes]);

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (isVoting) return;
    const previousVote = currentVote;

    try {
      setCurrentVote(prevVote => (prevVote === voteType ? null : voteType));

      // Make server request
      await mutateVote({
        postId: post.id,
        voteType,
        currentVote: previousVote,
        user_id: userId,
        relatedUserId: post.created_by   ?? "",
      });

      if (isError) {
        // Revert changes if server request fails
        setCurrentVote(previousVote);
        // setUpvoteCount(post.upvotes);
        // setDownvoteCount(post.downvotes);
      }
    } catch (_) {
      // Revert changes on error
      setCurrentVote(previousVote);
    }
  };

  const handlePostClick = (postId: string) => {
    const viewContext = {
      scrollY: window.scrollY,
      timestamp: Date.now(),
      viewportHeight: window.innerHeight,
      lastVisiblePost:
        document.elementFromPoint(0, window.innerHeight - 10)?.id || postId,
      section: 'feed',
    };

    sessionStorage.setItem('feedViewContext', JSON.stringify(viewContext));
    router.push(`post/${post.id}?type=comment`);
  };

  const upvoteCount = post.upvotes;
  const downvoteCount = post.downvotes;


  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        {isPending && <div className='h-5 w-5 bg-gray-500/50 animate-pulse'/>}

       {
        isSuccess && (
          <button
          type="button"
          onClick={() => handleVote('upvote')}
          disabled={isVoting}
          className="focus:outline-none"
          id="upvote-btn"
        >
          <ThumbsUp
            className={cn(
              'h-5 w-5 transition-colors duration-200 md:hover:scale-110',
              currentVote === 'upvote'
                ? 'fill-green-500 stroke-green-500 dark:fill-green-400 dark:stroke-green-400'
                : 'stroke-gray-500 hover:stroke-gray-700 dark:stroke-gray-400 dark:hover:stroke-gray-300',
            )}
          />
        </button>
        )
       }
        <AnimatePresence mode="wait">
          <motion.span
            key={upvoteCount}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="min-w-[2ch] text-center font-button-small"
            id="upvote-count"
          >
            {upvoteCount}
          </motion.span>
        </AnimatePresence>
        {isPending && <div className='h-5 w-5 bg-gray-500/50 animate-pulse'/>}
        {isSuccess && (
          <button
          type="button"
          onClick={() => handleVote('downvote')}
          disabled={isVoting}
          className="focus:outline-none"
          id="downvote-btn"
        >
          <ThumbsDown
            className={cn(
              'h-5 w-5 transition-all duration-200 md:hover:scale-110',
              currentVote === 'downvote'
                ? 'fill-red-500 stroke-red-500 dark:fill-red-400 dark:stroke-red-400'
                : 'stroke-gray-500 hover:stroke-gray-700 dark:stroke-gray-400 dark:hover:stroke-gray-300',
            )}
          />
        </button>
        )}
        <AnimatePresence mode="wait">
          <motion.span
            key={downvoteCount}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="min-w-[2ch] text-center font-button-small"
            id="downvote-count"
          >
            {downvoteCount}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1" id="comment-btn">
        {section === 'details' ? (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 -scale-x-100 text-gray-600"
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
          <div
            className="text-default-400 text-small cursor-pointer font-semibold"
            onClick={() => handlePostClick(post.id)}
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
          </div>
        )}
        <p className="font-button-small">
          {section === 'details'
            ? commentLength
            : Array.isArray(post?.comments)
              ? post.comments[0] && 'count' in post.comments[0]
                ? post.comments[0].count
                : post.comments.length
              : 0}
        </p>
      </div>
    </div>
  );
};

export default PostMetrics;

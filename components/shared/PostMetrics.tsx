'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
//import Link from 'next/link';
import { cn } from '@/lib/utils';
import { voteAction } from '@/app/actions';
import { Comment } from '@/types/global';

interface PostMetricsProps {
  post: {
    id: string;
    created_by: string;
    upvotes: number;
    downvotes: number;
    comments: { count: number }[] | Comment[];
  };
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
  votes = [],
}: PostMetricsProps) => {
  const router = useRouter()

  // Get the current user's vote if it exists
  const userVote = votes.find(vote => vote.user_id === userId)?.vote_type || null;
  
  const [currentVote, setCurrentVote] = useState<string | null>(userVote);
  const [upvoteCount, setUpvoteCount] = useState(post.upvotes);
  const [downvoteCount, setDownvoteCount] = useState(post.downvotes);
  const [isVoting, setIsVoting] = useState(false);

 

  useEffect(() => {
    setCurrentVote(userVote);
    setUpvoteCount(post.upvotes);
    setDownvoteCount(post.downvotes);
  }, [post.upvotes, post.downvotes, userVote]);

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (isVoting) return;
    setIsVoting(true);
    const previousVote = currentVote;

    try {
      // Optimistically update UI
      const isRemovingVote = currentVote === voteType;

      // Update vote counts based on the action
      if (isRemovingVote) {
        // Removing vote
        if (voteType === 'upvote') setUpvoteCount(prev => prev - 1);
        else setDownvoteCount(prev => prev - 1);
        setCurrentVote(null);
      } else {
        // Adding or changing vote
        if (voteType === 'upvote') {
          setUpvoteCount(prev => prev + 1);
          if (currentVote === 'downvote') setDownvoteCount(prev => prev - 1);
        } else {
          setDownvoteCount(prev => prev + 1);
          if (currentVote === 'upvote') setUpvoteCount(prev => prev - 1);
        }
        setCurrentVote(voteType);
      }

      // Make server request
      const result = await voteAction(post.id, voteType, previousVote, userId, post.created_by);

      if (!result.success) {
        // Revert changes if server request fails
        setCurrentVote(previousVote);
        setUpvoteCount(post.upvotes);
        setDownvoteCount(post.downvotes);

      }
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Revert changes on error
      setCurrentVote(previousVote);
      setUpvoteCount(post.upvotes);
      setDownvoteCount(post.downvotes);
    } finally {
      setIsVoting(false);
    }
  };

  const handlePostClick = (postId: string) => {
    const viewContext = {
      scrollY: window.scrollY,
      timestamp: Date.now(),
      viewportHeight: window.innerHeight,
      lastVisiblePost: document.elementFromPoint(0, window.innerHeight - 10)?.id || postId,
      section: 'feed'
    };

    sessionStorage.setItem('feedViewContext', JSON.stringify(viewContext));
    router.push(`post/${post.id}?type=comment`);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => handleVote('upvote')}
          disabled={isVoting}
          className="focus:outline-none"
          id='upvote-btn'
        >
          <ThumbsUp
            className={cn(
              'h-5 w-5 transition-all duration-200 md:hover:scale-110',
              currentVote === 'upvote'
                ? 'fill-green-500 stroke-green-500 dark:fill-green-400 dark:stroke-green-400'
                : 'stroke-gray-500 hover:stroke-gray-700 dark:stroke-gray-400 dark:hover:stroke-gray-300'
            )}
          />
        </button>
        <span className="min-w-[2ch] text-center font-medium text-sm" id='upvote-count'>
         {upvoteCount}
        </span>
        <button
          type="button"
          onClick={() => handleVote('downvote')}
          disabled={isVoting}
          className="focus:outline-none"
          id='downvote-btn'
        >
          <ThumbsDown
            className={cn(
              'h-5 w-5 transition-all duration-200 md:hover:scale-110',
              currentVote === 'downvote'
                ? 'fill-red-500 stroke-red-500 dark:fill-red-400 dark:stroke-red-400'
                : 'stroke-gray-500 hover:stroke-gray-700 dark:stroke-gray-400 dark:hover:stroke-gray-300'
            )}
          />
        </button>
        <span className="min-w-[2ch] text-center font-medium text-sm" id='downvote-count'>
         {downvoteCount}
        </span>
      </div>

      <div className="flex items-center gap-1" id='comment-btn'>
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
            className="text-default-400 text-small font-semibold cursor-pointer"
            onClick={()=>handlePostClick(post.id)}
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
        <p className="text-default-400 text-small">
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

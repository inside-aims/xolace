import React, {useState, useEffect} from 'react'
import { ShadowBtn } from '@/components/health-space/reflection/shadow-btn';
import {  Heart } from 'lucide-react';
import { getVideoLikeStatus } from '@/queries/videos/getVideoLikeStatus';
import { useVideoLikes } from '@/hooks/videos/useVideoLikesMutation';
import { toast } from 'sonner';

const LikeVideoButton = ({videoId, userId, likesCount, bunny_video_id, createdBy}: {videoId: string, userId: string | undefined, likesCount: number, bunny_video_id: string, createdBy: string | null}) => {
    const { data: hasLiked,  isPending} = getVideoLikeStatus(videoId, userId ?? '');
    const { mutateLike, isLoading, isError } = useVideoLikes();

    const [isHasLiked, setIsHasLiked] = useState(hasLiked);
    const [videoLikesCount, setVideoLikesCount] = useState(likesCount);

    useEffect(() => {
        setIsHasLiked(hasLiked);
    }, [hasLiked]);

    useEffect(() => {
        setVideoLikesCount(likesCount);
    }, [likesCount]);

    const handleClick = () => {
        if (!userId) {
          toast.error('Please login to like videos');
          return;
        }
    
        // Optimistically update the UI
        const currentlyLiked = hasLiked ?? false;
        setIsHasLiked(!currentlyLiked);
        if(currentlyLiked) {
            setVideoLikesCount(videoLikesCount - 1);
        } else {
            setVideoLikesCount(videoLikesCount + 1);
        }

        mutateLike({
          currentlyLiked: currentlyLiked,
          userId,
          videoId,
          bunny_video_id,
          relatedUserId: createdBy,
        });
      };

      if(isError){
        toast.error('Failed to like video. Please try again.');
        setIsHasLiked(hasLiked);
        setVideoLikesCount(likesCount);
      }


      if(isPending) return <div className='h-8 w-16 shadow-md rounded-2xl bg-gray-500/50 animate-pulse'/>

  return (
    <ShadowBtn
    key={'likes'}
    value={videoLikesCount}
    className={`hover:bg-gray-800 ${
        isHasLiked
          ? 'text-rose-500 dark:text-rose-500! border-rose-500 dark:border-rose-500'
          : 'text-gray-600 dark:text-white'
      }`}
    icon={<Heart className={`size-4 sm:size-4 ${isHasLiked ? 'fill-rose-500 dark:fill-rose-500' : ''}`} />}
    onClick={handleClick}
    disabled={isLoading}
  />
  )
}

export default LikeVideoButton
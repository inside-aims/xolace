// hooks/useVideoLikes.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeVideoAction, unlikeVideoAction } from '@/lib/actions/videoLikes.action';

export function useVideoLikes() {
  const qc = useQueryClient();

  const likeVideoMutation = useMutation({
    mutationFn: async ({videoId, userId, relatedUserId, bunny_video_id, currentlyLiked }: {videoId : string , userId: string , relatedUserId: string | null, bunny_video_id: string, currentlyLiked: boolean}) => {
      return currentlyLiked ? unlikeVideoAction(userId, videoId) : likeVideoAction(userId, relatedUserId, videoId, bunny_video_id);
    },
    onMutate: async ({ userId, videoId }) => {
      // Optimistic update: cancel any outgoing refetches for this video
      await qc.cancelQueries({ queryKey: ['video', videoId] });
      await qc.cancelQueries({ queryKey: ['videoLikedStatus', videoId, userId] });

      // Snapshot the previous values
      const previousVideo = qc.getQueryData(['video', videoId]);
      const previousLikedStatus = qc.getQueryData(['videoLikedStatus', videoId, userId]);

      // Optimistically update the video's like count and the user's liked status
      qc.setQueryData(['video', videoId], (old : any) => {
        if (!old) return old;
        return {
          ...old,
          likes_count: previousLikedStatus ? old.likes_count - 1 : old.likes_count + 1,
        };
      });
      qc.setQueryData<boolean>(['videoLikedStatus', videoId, userId], (old : any) => !old);

      return { previousVideo, previousLikedStatus };
    },
    onSuccess: (_ , variables) => {
      // Invalidate queries to refetch updated data
      qc.invalidateQueries({queryKey: ['video', variables.videoId] });
    }
  });

  return {
    mutateLike: likeVideoMutation.mutate,
    isLoading: likeVideoMutation.isPending,
    isError: likeVideoMutation.isError,
  };
}

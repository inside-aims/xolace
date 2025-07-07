// /hooks/use-save-video.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { saveVideoToCollectionAction, removeVideoFromCollectionAction } from '@/app/actions';

interface SaveVideoPayload {
  isCurrentlySaved: boolean;
  userId: string;
  videoId: string;
  bunny_video_id: string;
  createdBy: string | null;
}

export function useSaveToVideoCollectionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isCurrentlySaved, userId, videoId, bunny_video_id, createdBy }: SaveVideoPayload) => {
      if (isCurrentlySaved) {
        return removeVideoFromCollectionAction({ userId, videoId });
      } else {
        return saveVideoToCollectionAction({ userId, videoId, bunny_video_id, createdBy });
      }
    },
    onSuccess: (result, variables) => {
        if (result.success) {
            if (variables.isCurrentlySaved) {
                // You can show a toast on successful removal if you want
                // toast.success("Removed from your collection.");
            } else {
                toast.success("Saved to your collection!");
            }
        } else {
             toast.error(result.error || "An unknown error occurred.");
             console.log("Error ", result.error)
        }
    },
    onError: (error) => {
      // This will handle network errors or if the action throws an unhandled exception
      toast.error(error.message || 'An unexpected error occurred.');
      console.log("Error ", error)
    },
    onSettled: (data, error, variables) => {
      // This runs after success or error. It's the perfect place to invalidate queries
      // to ensure the client has the fresh, canonical state from the server.
      queryClient.invalidateQueries({ queryKey: ['video', variables.videoId] });
      queryClient.invalidateQueries({ queryKey: ['collections', 'video']}); // A general key for video collections
    },
  });
}
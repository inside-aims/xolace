// In @/hooks/videos/useVideoUploadUrlMutation.ts

import { useMutation } from '@tanstack/react-query';
import { getVideoUploadUrl } from '@/utils/bunny/bunny';
import { toast } from 'sonner';

export function useVideoUploadUrlMutation() {

  const uploadMutation = useMutation({
    mutationFn: async () => {
        const { videoId, uploadUrl, accessKey } = await getVideoUploadUrl();
        return { videoId, uploadUrl, accessKey };
    },
    onError: () => {
      toast.error('Failed to upload video. Please try again.');
    },
  });

  return {
    // Export mutateAsync, preferably with a descriptive name
    getVideoUploadUrlAsync: uploadMutation.mutateAsync,
    isLoading: uploadMutation.isPending,
    isError: uploadMutation.isError,
  };
}
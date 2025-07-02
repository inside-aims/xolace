// In @/hooks/videos/useVideoUploadUrlMutation.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getVideoUploadUrl } from '@/utils/bunny/bunny';
import { toast } from 'sonner';

export function useVideoUploadUrlMutation() {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async () => {
        const { videoId, uploadUrl, accessKey } = await getVideoUploadUrl();
        return { videoId, uploadUrl, accessKey };
    },
    onSuccess: (data) => {
      console.log('Upload video mutation succeeded:', data);
    },
    onError: (error) => {
      console.error('Upload video mutation failed:', error);
      toast.error('Failed to register your upload. Please try again.');
    },
  });

  return {
    // Export mutateAsync, preferably with a descriptive name
    getVideoUploadUrlAsync: uploadMutation.mutateAsync,
    isLoading: uploadMutation.isPending,
    isError: uploadMutation.isError,
  };
}
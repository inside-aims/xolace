import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getThumbnailUploadUrl } from '@/utils/bunny/bunny';
import { toast } from 'sonner';

export function useThumbnailUploadUrlMutation() {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({videoId}: {videoId: string}) => {
        const { uploadUrl, cdnUrl, accessKey } = await getThumbnailUploadUrl(videoId);
        return { uploadUrl, cdnUrl, accessKey };
    },
    onSuccess: (data, variables, context) => {
      console.log('Upload thumbnail mutation succeeded:', data);
      return data;
    },
    onError: (error, variables, context) => {
      console.error('Upload thumbnail mutation failed:', error);
      toast.error('Failed to register your upload. Please try again.');
    },
  });

  return {
    mutateUpload: uploadMutation.mutate,
    isLoading: uploadMutation.isPending,
    isError: uploadMutation.isError,
    data: uploadMutation.data,
  };
}

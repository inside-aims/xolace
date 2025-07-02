import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveVideoDetails } from '@/utils/bunny/bunny';
import { toast } from 'sonner';
import { VideoDetails } from '@/components/health-space/reflection';

export function useSaveVideoDetailsMutation() {
    const queryClient = useQueryClient();
  
    const saveDetailsMutation = useMutation({
      mutationFn: async (videoDetails: VideoDetails) => {
        return saveVideoDetails(videoDetails);
      },
      onSuccess: (data) => {
        console.log('Save video details mutation succeeded:', data);
        // Invalidate queries here if needed, e.g., to refetch a list of videos
        // queryClient.invalidateQueries({ queryKey: ['videos'] });
      },
      onError: (error) => {
        console.error('Save video details mutation failed:', error);
        toast.error('Failed to save video details. Please try again.');
      },
    });
  
    return {
      // Export the async version
      saveVideoDetailsAsync: saveDetailsMutation.mutateAsync,
      isLoading: saveDetailsMutation.isPending,
    };
  }

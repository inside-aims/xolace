import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { logActivity } from '@/lib/activity-logger';
import { ActivityType } from '@/types/activity';
import { calculateExpiryDate, removeHashtags } from '@/lib/utils';
import { UserCampfire } from '@/components/campfires/campfire-selector';
import { UserPreferences } from '@/lib/store/preferences-store';

export interface PostSubmissionData {
  content: string;
  is24HourPost: boolean;
  type: 'single' | 'carousel';
  selectedMood: {
    id:
      | 'neutral'
      | 'confused'
      | 'sad'
      | 'happy'
      | 'angry'
      | 'thoughtful'
      | 'chill'
      | 'grateful'
      | 'laughing'
      | 'inspired'
      | 'peaceful'
      | 'melancholy'
      | 'creative'
      | 'nostalgic'
      | 'motivated'
      | 'excited'
      | 'energetic';
  };
  tags: string[];
  slides: string[];
  selectedCampfire: UserCampfire | null;
  promptId?: string;
  promptText?: string;
  userId: string;
  preferences: UserPreferences | null;
  contentForLLM: string;
}

export function usePostSubmission() {
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();

  const postMutation = useMutation({
    mutationFn: async (data: PostSubmissionData) => {
      const {
        content,
        is24HourPost,
        type,
        selectedMood,
        tags,
        slides,
        selectedCampfire,
        promptId,
        promptText,
        userId,
        preferences,
      } = data;

      // Process content and slides
      const contentWithoutTags = removeHashtags(content);
      const duration = is24HourPost ? 24 : null;
      const expires_at = duration ? calculateExpiryDate(duration) : null;

      // Filter out empty slides and remove hashtags
      const filteredSlides = slides.filter(slide => slide.trim() !== '');
      const slidesWithoutTags = filteredSlides.map(slide =>
        removeHashtags(slide),
      );

      const is_prompt_response = !!promptId;

      // Create the post
      const { data: post_id, error: postError } = await supabase.rpc(
        'create_post_with_tags',
        {
          content: contentWithoutTags || slides[0],
          mood: selectedMood?.id,
          expires_in_24hr: is24HourPost,
          duration: duration ? `${duration}` : duration,
          expires_at,
          is_sensitive: preferences?.mark_sensitive_by_default ?? false,
          is_prompt_response,
          tag_names: tags,
          type,
          slide_contents: slidesWithoutTags,
          campfire_id: selectedCampfire
            ? selectedCampfire.campfireId
            : undefined,
          daily_prompt_id: is_prompt_response ? promptId : undefined,
        },
      );

      if (postError) {
        throw new Error(postError.message || 'Failed to create post');
      }

      // If this is a prompt response, create the prompt response record
      if (promptId && post_id) {
        const { error: promptResponseError } = await supabase
          .from('prompt_responses')
          .insert({
            post_id: post_id,
            prompt_id: promptId,
            user_id: userId,
          });

        if (promptResponseError) {
          console.error('Error creating prompt response:', promptResponseError);
          // Don't throw here as the post was created successfully
        }
      }

      // let match = ''
      // Log the post creation activity
      if (post_id) {
        try {
          await logActivity({
            userId: userId,
            entityType: ActivityType.POST,
            action: 'created',
            postId: post_id,
            metadata: {
              expires_in_24: is24HourPost,
              mood: selectedMood?.id,
              is_prompt_response: !!promptId,
              prompt_text: promptText || undefined,
              type: type,
            },
          });

          // const response = await fetch('/api/v1/lemurRequest', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ post: contentForLLM }),
          // });
          

          // const responseBody = await response.json();
          // const lemurResponse = responseBody.response;

          // match = lemurResponse.split(/[*]*suggestion:\**/i)[1]?.trim();
          // const m = lemurResponse.match(/(?:Emotion:\s*)?([A-Za-z-]+)\s*\|\s*suggestion:\s*(.+)$/i);
          // const emotion = m?.[1]?.toLowerCase() ?? null;
          // const suggestion = m?.[2]?.trim() ?? null;
          // match = lemurResponse;
        } catch (activityError) {
          console.error('Error logging activity:', activityError);
          // Don't throw as post creation was successful
        }
      }

      return {
        post_id,
        is_prompt_response,
        promptId,
        // match
      };
    },

    onSuccess: async (result, variables) => {
      const {  is_prompt_response, promptId } = result;
      const { userId } = variables;

      // Show success notification
      if (is_prompt_response) {
        toast.success('Your response has been saved! 🙂‍↕️', {
          position: 'bottom-center',
        });
      } else {
        toast.success('Post created successfully 🤭 !', {
          position: 'bottom-center',
        });
      }

      // Invalidate and refetch the enhanced feed
      queryClient.invalidateQueries({
        queryKey: ['enhanced-feed'],
      });

      // CRITICAL FIX 2: Also invalidate with specific user ID
      await queryClient.invalidateQueries({
        queryKey: ['enhanced-feed', userId],
        exact: false,
      });

      // CRITICAL FIX 3: Remove prefetched server data that might conflict
      queryClient.removeQueries({
        queryKey: ['enhanced-feed'],
        exact: false,
      });

      // Also invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });

      // If it's a campfire post, invalidate campfire feeds
      if (variables.selectedCampfire) {
        queryClient.invalidateQueries({
          queryKey: [
            'campfires',
            'public',
            variables.selectedCampfire.slug,
            userId,
          ],
        });
      }

      // If it's a prompt response, invalidate prompt responses
      if (promptId) {
        queryClient.invalidateQueries({
          queryKey: ['prompt-responses', promptId],
        });
      }

      // Optionally, you can add the new post to the cache optimistically
      // This would show the post immediately without waiting for refetch
      // queryClient.setQueryData(['enhanced-feed', userId], (oldData: any) => {
      //   if (!oldData) return oldData;
      //   // Add new post to the beginning of the first page
      //   // Note: You'd need the full post object for this
      // });
    },

    onError: () => {
      toast.error('Oops, something must have gone wrong 😵‍💫! Please try again', {
        position: 'bottom-center',
      });
    },
  });

  return {
    submitPost: postMutation.mutateAsync,
    isSubmitting: postMutation.isPending,
    isError: postMutation.isError,
    error: postMutation.error,
    reset: postMutation.reset,
  };
}

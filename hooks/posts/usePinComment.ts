// /hooks/posts/usePinComment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

export function usePinComment(postId?: string) {
    const queryClient = useQueryClient();
    const supabase = getSupabaseBrowserClient();

    return useMutation({
        mutationFn: async ({ commentId, pinLevel }: { commentId: number, pinLevel: 'author' | 'professional' }) => {
            const { error } = await supabase.rpc('pin_comment', {
                comment_id_to_pin: commentId,
                pin_level: pinLevel
            });
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            // Refetch the comment thread to show the new pinned order
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            toast.success("Comment pin status updated!");
        },
        onError: (error) => {
            console.log(error)
            toast.error("Failed to update pin", { description: error.message });
        }
    });
}
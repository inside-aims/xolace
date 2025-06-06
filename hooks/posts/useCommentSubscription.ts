import { useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { Comment } from '@/types/global';

type Props = {
  onInsert?: (newComment: Comment) => void;
  onUpdate?: (updatedComment: Comment) => void;
  onDelete?: (deletedCommentId: number) => void;
};

export const useCommentSubscription = ({ onInsert, onUpdate, onDelete }: Props) => {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const listener = (payload: any) => {
      const eventType = payload.eventType;

      if (eventType === 'INSERT') {
        onInsert?.(payload.new);
      } else if (eventType === 'UPDATE') {
        onUpdate?.(payload.new);
      } else if (eventType === 'DELETE') {
        onDelete?.(payload.old.id);
      }
    };

    const subscription = supabase
      .channel('comment-subscription')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
        },
        listener
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [onInsert, onUpdate, onDelete]);
};

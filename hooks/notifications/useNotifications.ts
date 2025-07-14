// /hooks/useNotifications.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Notification } from '@/types/global';

// 1. Define the TypeScript type for a notification based on your new schema
// export type Notification = {
//   id: string;
//   created_at: string;
//   type: string;
//   is_read: boolean;
//   entity_id: string | null;
//   metadata: any;
//   author_name: string;
//   author_avatar_url: string | null;
//   recipient_user_id: string;
//   actor_id: string | null;
//   target_type: 'single_user' | 'role_based' | 'all_users' | 'new_users' | null;
// };

interface UsePanelNotificationsProps {
  userId?: string;
  filter: 'all' | 'important';
}

// 2. Custom hook to fetch the list of notifications for the panel
export function usePanelNotifications({ userId, filter }: UsePanelNotificationsProps) {
  const supabase = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ['notifications', 'panel', filter, userId],
    queryFn: async () => {
      if (!userId) return [];

      let query = supabase
        .from('notifications')
        .select('*') // The new columns `author_name` and `author_avatar_url` are included
        .eq('recipient_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      // Filter for important notifications (system announcements) at the database level
      if (filter === 'important') {
        query = query.eq('type', 'system_announcement');
      }

      const { data, error } = await query;
      if (error) {
        toast.error("Failed to load notifications.");
        throw new Error(error.message);
      }
      return data as Notification[];
    },
    enabled: !!userId, // Only run the query if the user is logged in
  });
}

// 3. Custom hook for the "Mark all as read" mutation
export function useMarkAllNotificationsAsRead() {
    const queryClient = useQueryClient();
    const supabase = getSupabaseBrowserClient();

    return useMutation({
        mutationFn: async () => {
            const { error } = await supabase.rpc('mark_all_notifications_as_read');
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            // When successful, invalidate all related queries to update the UI
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.success("All notifications marked as read.");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to mark notifications as read.");
        }
    });
}

// 2. Create a mutation to mark the notification as read
export function useMarkNotificationAsRead(notification: Notification) {
    const queryClient = useQueryClient();
    const supabase = getSupabaseBrowserClient();

    return useMutation({
        mutationFn: async () => {
            const { error } = await supabase.rpc('mark_notification_as_read', { notification_id: notification.id });
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            // When successful, invalidate all related queries to update the UI
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to mark notification as read.");
        }
    });
}

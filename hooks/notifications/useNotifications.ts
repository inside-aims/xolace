// /hooks/useNotifications.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Notification } from '@/types/global';
import { useMemo } from 'react';
import { useInfiniteQuery, type SupabaseQueryHandler } from '@/hooks/use-infinite-query';
import {
  startOfToday, endOfToday, startOfYesterday, endOfYesterday,
  startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths
} from 'date-fns';
import { useUserState } from '@/lib/store/user';


// Define the types for our filters
export type StatusFilter = 'all' | 'read' | 'unread' | 'important';
export type TimeFilter = 'all' | 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth';

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

interface UseInfiniteNotificationsProps {
  userId?: string;
  statusFilter: StatusFilter;
  timeFilter: TimeFilter;
  pageSize?: number;
}

// Helper function to get date ranges for Supabase queries
const getDateRange = (timeFilter: TimeFilter) => {
  const now = new Date();
  switch (timeFilter) {
    case 'today':
      return { start: startOfToday(), end: endOfToday() };
    case 'yesterday':
      return { start: startOfYesterday(), end: endOfYesterday() };
    case 'thisWeek':
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
    case 'lastWeek':
      const lastWeek = subWeeks(now, 1);
      return { start: startOfWeek(lastWeek, { weekStartsOn: 1 }), end: endOfWeek(lastWeek, { weekStartsOn: 1 }) };
    case 'thisMonth':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'lastMonth':
      const lastMonth = subMonths(now, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    default:
      return null; // For 'all' time
  }
};


// 1. Custom hook to fetch the list of notifications for the panel
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

export function useNotificationDetails({notificationId}: {notificationId: string}) {
  const supabase = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ['notification', notificationId],
    queryFn: async () => {
      const { data, error } = await supabase.from('notifications').select('*').eq('id', notificationId).single();
      if (error) throw new Error(error.message);
      return data as Notification;
    },
    enabled: !!notificationId,
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


// The main hook for the notifications page
export function useInfiniteNotifications({
  userId,
  statusFilter,
  timeFilter,
  pageSize = 15,
}: UseInfiniteNotificationsProps) {

  // useMemo prevents the query function from being recreated on every render,
  // which is crucial for the stability of useInfiniteQuery.
  const trailingQuery = useMemo(() => {
    const queryHandler: SupabaseQueryHandler<'notifications'> = (query) => {
      // 1. Add status filters
      if (statusFilter === 'read') query = query.eq('is_read', true);
      if (statusFilter === 'unread') query = query.eq('is_read', false);
      if (statusFilter === 'important') query = query.eq('type', 'system_announcement');

      // 2. Add time filters
      const dateRange = getDateRange(timeFilter);
      if (dateRange) {
        query = query.gte('created_at', dateRange.start.toISOString());
        query = query.lte('created_at', dateRange.end.toISOString());
      }
      
      // 3. Add recipient filter and ordering
      return query
        .eq('recipient_user_id', userId || '')
        .order('created_at', { ascending: false });
    };
    return queryHandler;
  }, [userId, statusFilter, timeFilter]);

  return useInfiniteQuery<Notification, 'notifications'>({
    tableName: 'notifications',
    columns: '*',
    trailingQuery: trailingQuery,
    pageSize: pageSize,
    idColumn: 'id',
  });
}

// delete all notifications , remove rpc and use supabase client
export function useDeleteAllNotifications() {
    const queryClient = useQueryClient();
    const supabase = getSupabaseBrowserClient();
    const user = useUserState(state => state.user);

    return useMutation({
        mutationFn: async () => {
            const { error } = await supabase.from('notifications').delete().eq('recipient_user_id', user?.id || '');
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            // When successful, invalidate all related queries to update the UI
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.success("All notifications deleted.");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete notifications.");
        }
    });
}
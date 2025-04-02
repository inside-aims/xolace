import { create } from 'zustand';
import { DbActivityLog } from '@/types/activity';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useUserState } from '@/lib/store/user';

interface ActivityState {
  logs: DbActivityLog[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  page: number;
  fetchLogs: (filter?: string, viewType?: "my-activities" | "related-to-me") => Promise<void>;
  resetLogs: () => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  logs: [],
  isLoading: false,
  hasMore: true,
  error: null,
  page: 1,
  
  fetchLogs: async (filter = 'all', viewType = 'my-activities') => {
    const { page, logs } = get();
    const supabase = getSupabaseBrowserClient();

    // Wait for hydration and user initialization
    await new Promise(resolve => setTimeout(resolve, 50));
    const user = useUserState.getState().user;
    //const user = useUserState(state => state.user)

    
    if (!user) {
      set({ error: 'User not authenticated', isLoading: false });
      return;
    }
    
    set({ isLoading: true });
    
    try {
      const pageSize = 10;
      const startIndex = (page - 1) * pageSize;
      
      let query = supabase
      .from('activity_logs')
      .select(`
        id,
        user_id(id, avatar_url, username),
        related_user_id(id, avatar_url, username),
        entity_type,
        post_id,
        comment_id,
        vote_id,
        report_id,
        profile_id,
        action,
        metadata,
        created_at,
        ip_address
      `)
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + pageSize - 1);
    
      
      // Apply viewType filter
      if (viewType === 'my-activities') {
        query = query.eq('user_id', user.id);
      } else if (viewType === 'related-to-me') {
        query = query.eq('related_user_id', user.id);
      }
      
      // Apply action/entity type filter
      if (filter !== 'all') {
        switch (filter) {
          case 'posts':
            query = query.eq('entity_type', 'post');
            break;
          case 'comments':
            query = query.eq('entity_type', 'comment');
            break;
          case 'votes':
            query = query.or(`action.eq.upvoted,action.eq.downvoted`);
            break;
          case 'views':
            query = query.eq('action', 'viewed');
            break;
        }
      }
      
      // const { data: activityData, error, count } = await query; // for later
      const { data: activityData, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Transform the data to match ActivityLog type
      const transformedLogs = activityData.map((log: any) => ({
        id: log.id,
        user_id: log.user_id,
        user: log.profiles,
        related_user_id: log.related_user_id,
        related_user: log.related_profiles,
        entity_type: log.entity_type,
        entity_id: log[`${log.entity_type}_id`] || null,
        action: log.action,
        metadata: log.metadata,
        created_at: log.created_at,
        ip_address: log.ip_address,
      }));
      
      const hasMore = activityData.length === pageSize;
      
      set({
        logs: page === 1 ? transformedLogs : [...logs, ...transformedLogs],
        page: page + 1,
        hasMore,
        isLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error fetching activity logs:', error);
      set({ 
        error: 'Failed to fetch activity logs', 
        isLoading: false 
      });
    }
  },
  
  resetLogs: () => {
    set({
      logs: [],
      page: 1,
      hasMore: true,
      error: null,
    });
  },
}));
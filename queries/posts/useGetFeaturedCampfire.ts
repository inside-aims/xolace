import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useCampfireMembership } from '@/hooks/campfires/useCampfireMembership';

export interface FeaturedCampfire {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  banner_url: string | null;
  purpose: string;
  member_count: number;
  created_at: string;
}

export interface FeaturedCampfireWithMembership extends FeaturedCampfire {
    is_member: boolean;
  }

const FEATURED_CAMPFIRE_STALE_TIME = 15 * 60 * 1000; // 15 minutes (featured content doesn't change often)
const FEATURED_CAMPFIRE_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

// Dummy data for development
const DUMMY_FEATURED_CAMPFIRE: FeaturedCampfire = {
  id: 'featured-campfire-1',
  name: 'Mental Health Warriors',
  slug: 'mental-health-warriors',
  description:
    'A supportive community where we share experiences, coping strategies, and encourage each other through mental health journeys. Join us! 💪',
  icon_url: null,
  banner_url: null,
  purpose: 'mental_health_support',
  member_count: 2847,
  created_at: new Date().toISOString(),
};

export function useGetFeaturedCampfireBase() {
  const supabase = getSupabaseBrowserClient();

  return useQuery<FeaturedCampfire, Error>({
    queryKey: ['featured-campfire'],
    queryFn: async () => {
      // ============================================
      // PRODUCTION CODE (commented out for now)
      // ============================================

      const { data, error } = await supabase
        .from('campfires')
        .select(
          'id, name, slug, description, icon_url, banner_url, purpose, member_count, created_at',
        )
        .eq('visibility', 'public')
        .order('member_count', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No featured campfire found');
      }

      return data as FeaturedCampfire;

      // ============================================
      // ALTERNATIVE SCALABLE APPROACHES:
      // ============================================

      // Option 1: Weighted scoring (most balanced approach)
      // Consider multiple factors: member count, recent activity, engagement
      /*
      const { data, error } = await supabase.rpc('get_featured_campfire', {
        // This would be a DB function that calculates:
        // score = (member_count * 0.4) + (posts_last_week * 0.3) + (engagement_rate * 0.3)
      });
      */

      // Option 2: Rotation system (prevents same campfire always showing)
      // Store featured campfires in a separate table with rotation logic
      /*
      const { data, error } = await supabase
        .from('featured_campfires')
        .select(`
          campfire_id,
          campfires (
            id, name, slug, description, icon_url, banner_url, purpose, member_count, created_at
          )
        `)
        .eq('is_active', true)
        .order('last_featured_at', { ascending: true })
        .limit(1)
        .single();
      */

      // Option 3: Time-based rotation (different featured campfire for different times)
      // Hash current day/week to pick from top N campfires
      /*
      const topCampfires = await supabase
        .from('campfires')
        .select('*')
        .eq('visibility', 'public')
        .order('member_count', { ascending: false })
        .limit(10);
      
      const dayOfWeek = new Date().getDay();
      const featured = topCampfires.data[dayOfWeek % topCampfires.data.length];
      */

      // ============================================
      // DUMMY DATA (current implementation)
      // ============================================
      // Simulate network delay
      //   await new Promise(resolve => setTimeout(resolve, 100));
      //   return DUMMY_FEATURED_CAMPFIRE;
    },
    staleTime: FEATURED_CAMPFIRE_STALE_TIME,
    gcTime: FEATURED_CAMPFIRE_CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Fail silently - don't break the feed if featured campfire fails to load
    retry: 1,
    retryDelay: 1000,
  });
}


export function useGetFeaturedCampfire(userId?: string) {
    // Fetch featured campfire (long cache)
    const { 
      data: campfire, 
      isLoading: isCampfireLoading,
      isError: isCampfireError,
      error: campfireError 
    } = useGetFeaturedCampfireBase();
  
    // Fetch membership status separately (short cache)
    const { 
      data: isMember = false,
      isLoading: isMembershipLoading 
    } = useCampfireMembership({
      campfireId: campfire?.id || '',
      userId: userId || '',
    });
  
    // Combine the results
    return {
      data: campfire ? {
        ...campfire,
        is_member: isMember,
      } as FeaturedCampfireWithMembership : undefined,
      isLoading: isCampfireLoading || isMembershipLoading,
      isError: isCampfireError,
      error: campfireError,
    };
  }





  /**
 * Utility function to invalidate featured campfire cache
 * Use when campfire data changes (rare)
 */
export function invalidateFeaturedCampfireCache(queryClient: any) {
    queryClient.invalidateQueries({ queryKey: ['featured-campfire'] });
  }
  
  /**
   * Utility function to invalidate membership cache
   * Use when user joins/leaves a campfire (common)
   */
  export function invalidateMembershipCache(
    queryClient: any, 
    campfireId: string, 
    userId: string
  ) {
    queryClient.invalidateQueries({ 
      queryKey: ['campfire-membership', campfireId, userId] 
    });
  }
  
  /**
   * Utility function to update membership cache optimistically
   * Use for instant UI updates when joining/leaving
   */
  export function updateMembershipCacheOptimistically(
    queryClient: any,
    campfireId: string,
    userId: string,
    isMember: boolean
  ) {
    queryClient.setQueryData(
      ['campfire-membership', campfireId, userId],
      isMember
    );
  }
  

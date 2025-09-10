// queries/campfires/getCampfireWithSlug.ts
import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { CampfirePurpose } from '@/components/campfires/campfires.types';

export interface CampfireDetails {
  campfireId: string;
  name: string;
  slug: string;
  description: string;
  members: number;
  purpose: CampfirePurpose;
  iconURL?: string;
  bannerUrl?: string;
  isMember: boolean;
  createdAt: string;
  createdBy: string;
  visibility: 'public' | 'private' | 'restricted' | 'secret';
  memberRole: 'camper' | 'firestarter' | 'firekeeper' ;
  isFavorite: boolean;
  guideEnabled: boolean;
  guideShowOnJoin: boolean;
  guideHeaderLayout: 'Avatar and name';
  guideWelcomeMessage?: string;
}

const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const QUERY_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

export function getCampfireWithSlug(slug: string, userId?: string) {
  const supabase = getSupabaseBrowserClient();

  return useQuery<CampfireDetails, Error>({
    queryKey: ['campfires', 'public', slug, userId],
    queryFn: async () => {
      // Build the query with conditional left join for membership
      let query = supabase
        .from('campfires')
        .select(
          `
          id,
          name,
          slug,
          description,
          member_count,
          purpose,
          icon_url,
          banner_url,
          visibility,
          created_at,
          created_by,
          guide_enabled,
          guide_show_on_join,
          guide_header_layout, 
          guide_welcome_message
        `,
        )
        .eq('visibility', 'public')
        .eq('slug', slug)
        .single();

      const { data: campfireData, error: campfireError } = await query;

      if (campfireError) {
        console.error('Error fetching campfire details:', campfireError);
        throw new Error(campfireError.message);
      }

      if (!campfireData) {
        throw new Error('Campfire not found');
      }

      // Check membership separately if user is provided
      let isMember = false;
      let isFavorite = false;
      let memberRole: 'camper' | 'firestarter' | 'firekeeper' = 'camper';
      if (userId) {
        const { data: membershipData, error: membershipError } = await supabase
          .from('campfire_members')
          .select('id, role, is_favorite')
          .eq('campfire_id', campfireData.id)
          .eq('user_id', userId)
          .single();

        if (membershipError && membershipError.code !== 'PGRST116') {
          console.error('Error checking membership:', membershipError);
        }

        isMember = !!membershipData;
        memberRole = membershipData?.role || 'camper';
        isFavorite = membershipData?.is_favorite || false;
      }

      return {
        campfireId: campfireData.id,
        name: campfireData.name,
        slug: campfireData.slug,
        description: campfireData.description || '',
        members: campfireData.member_count || 0,
        purpose: campfireData.purpose,
        iconURL: campfireData.icon_url || undefined,
        bannerUrl: campfireData.banner_url || undefined,
        createdAt: campfireData.created_at,
        createdBy: campfireData.created_by,
        visibility: campfireData.visibility,
        isMember,
        memberRole,
        isFavorite,
        guideEnabled: campfireData.guide_enabled,
        guideShowOnJoin: campfireData.guide_show_on_join,
        guideHeaderLayout: campfireData.guide_header_layout,
        guideWelcomeMessage: campfireData.guide_welcome_message,
      } as CampfireDetails;
    },
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_CACHE_TIME,
    enabled: !!slug, // Only require slug, not userId
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry if campfire not found
      if (error.message.includes('not found')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
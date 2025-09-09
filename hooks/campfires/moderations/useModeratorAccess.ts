// hooks/useModeratorAccess.ts
'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useUserState } from '@/lib/store/user';

interface ModeratorAccessState {
  hasAccess: boolean | null; // null = checking, true = has access, false = no access
  loading: boolean;
  error?: string;
  userRole?: string;
  campfireId?: string;
}

export function useModeratorAccess(slug: string): ModeratorAccessState {
  const user = useUserState(state => state.user);
  const [state, setState] = useState<ModeratorAccessState>({
    hasAccess: null,
    loading: true,
  });

  useEffect(() => {
    async function checkAccess() {
      if (!user?.id) {
        setState({ 
          hasAccess: false, 
          loading: false, 
          error: 'You must be logged in to access mod tools' 
        });
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();

        // Get campfire ID from slug
        const { data: campfire, error: campfireError } = await supabase
          .from('campfires')
          .select('id')
          .eq('slug', slug)
          .single();

        if (campfireError || !campfire) {
          setState({ 
            hasAccess: false, 
            loading: false, 
            error: 'Campfire not found' 
          });
          return;
        }

        // Check user's role in the campfire
        const { data: membership, error: membershipError } = await supabase
          .from('campfire_members')
          .select('role')
          .eq('campfire_id', campfire.id)
          .eq('user_id', user.id)
          .single();

        if (membershipError || !membership) {
          setState({ 
            hasAccess: false, 
            loading: false, 
            campfireId: campfire.id,
            error: 'You are not a member of this campfire' 
          });
          return;
        }

        // Check if user has moderator privileges (firestarter or firekeeper)
        const hasModAccess = membership.role === 'firestarter' || membership.role === 'firekeeper';

        setState({
          hasAccess: hasModAccess,
          loading: false,
          userRole: membership.role,
          campfireId: campfire.id,
          error: hasModAccess ? undefined : 'You do not have moderator permissions for this campfire'
        });

      } catch (error) {
        console.error('Error checking moderator access:', error);
        setState({ 
          hasAccess: false, 
          loading: false, 
          error: 'Failed to verify permissions' 
        });
      }
    }

    if (slug) {
      checkAccess();
    }
  }, [slug, user?.id]);

  return state;
}
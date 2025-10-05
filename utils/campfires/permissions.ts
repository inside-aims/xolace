import { createClient } from '@/utils/supabase/server';

export async function checkModeratorAccess(slug: string, userId: string): Promise<{
  hasAccess: boolean;
  campfireId?: string;
  userRole?: string;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    
    // // Get current user
    // const supabase_user_id = (await supabase.auth.getClaims()).data?.claims?.sub ?? null;
    
    // if (!supabase_user_id) {
    //   return { hasAccess: false, error: 'Not authenticated' };
    // }

    // // Get user profile
    // const { data: profile } = await supabase
    //   .from('profiles')
    //   .select('id')
    //   .eq('supabase_user', supabase_user_id)
    //   .single();

    // if (!profile) {
    //   return { hasAccess: false, error: 'Profile not found' };
    // }

    // Get campfire ID from slug
    const { data: campfire , error: campfireError } = await supabase
      .from('campfires')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!campfire || campfireError) {
      return { hasAccess: false, error: 'Campfire not found' };
    }

    // Check user's role in the campfire
    const { data: membership } = await supabase
      .from('campfire_members')
      .select('role')
      .eq('campfire_id', campfire.id)
      .eq('user_id', userId)
      .single();

    if (!membership) {
      return { 
        hasAccess: false, 
        campfireId: campfire.id,
        error: 'You are not a member of this campfire' 
      };
    }

    // Check if user has moderator privileges (firestarter or firekeeper)
    const hasModAccess = membership.role === 'firestarter' || membership.role === 'firekeeper';

    return {
      hasAccess: hasModAccess,
      campfireId: campfire.id,
      userRole: membership.role,
      error: hasModAccess ? undefined : 'You do not have moderator permissions for this campfire'
    };
  } catch (error) {
    console.error('Error checking moderator access:', error);
    return { hasAccess: false, error: 'Failed to verify permissions' };
  }
}
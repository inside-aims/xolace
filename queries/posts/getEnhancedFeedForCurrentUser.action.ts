"use server"

import { createClient } from '@/utils/supabase/server';
import { EnhancedPost } from './getEnhancedFeed';

// Enhanced server action for initial feed data
export const getEnhancedFeed = async (userId?: string, pageSize: number = 50, offset: number = 0): Promise<EnhancedPost[]> => {
  const supabase = await createClient();

  if (!userId) {
    throw new Error('User ID is required');
  }

  const { data, error } = await supabase.rpc('get_personalized_feed', {
    user_id_param: userId,
    page_size: pageSize,
    offset_param: offset
  });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

// Alternative: Get user's profile ID from auth for server-side usage
export const getEnhancedFeedForCurrentUser = async (pageSize: number = 50, offset: number = 0): Promise<EnhancedPost[]> => {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Get profile ID
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('supabase_user', user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('Profile not found');
  }

  return getEnhancedFeed(profile.id, pageSize, offset);
};
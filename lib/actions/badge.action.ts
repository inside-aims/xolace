"use server"

import { createClient } from "@/utils/supabase/server";
import { assignBadges } from "@/utils/badge.utils";

export async function assignBadgesToUser(userId: string) {
    const supabase = await createClient();
    if(!userId) return{
        totalPosts: 0,
        totalComments: 0,
        totalUpvotes: 0,
        totalViews: 0,
        badges: { GOLD: 0, SILVER: 0, BRONZE: 0 },
      };

console.log("User ID:", userId)
    try {
        // Fetch stats using database function
        const { data, error } = await supabase.rpc('get_user_stats', {
          profile_id: userId
        });
    
        console.log("User stats:", data," ", error)
        if (error || !data || data.length === 0) {
          throw new Error(error?.message || 'User stats not found');
        }
    
        const stats = data[0];
        
        // Calculate badges
        const badges = assignBadges({
          criteria: [
            { type: 'POST_COUNT', count: Number(stats.total_posts) },
            { type: 'COMMENT_COUNT', count: Number(stats.total_comments) },
            { type: 'POST_UPVOTES', count: Number(stats.total_upvotes) },
            { type: 'TOTAL_VIEWS', count: Number(stats.total_views) },
          ],
        });
    
        return {
          totalPosts: Number(stats.total_posts),
          totalComments: Number(stats.total_comments),
          totalUpvotes: Number(stats.total_upvotes),
          totalViews: Number(stats.total_views),
          badges,
        };
      } catch (error) {
        console.error('Error fetching user stats:', error);
        return {
          totalPosts: 0,
          totalComments: 0,
          totalUpvotes: 0,
          totalViews: 0,
          badges: { GOLD: 0, SILVER: 0, BRONZE: 0 },
        };
      }
}

'use server';

// app/actions/videoLikes.ts
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { logActivity } from '../activity-logger';
import { ActivityType } from '@/types/activity';
import { createNotification } from '@/lib/actions/notifications.action';

export async function likeVideoAction(
  userId: string,
  relatedUserId: string | null,
  videoId: string,
  bunny_video_id: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('video_likes')
    .insert([{ user_id: userId, video_id: videoId }])
    .select();

  if (error) return { success: false, error: error.message };

  await logActivity({
    userId,
    relatedUserId,
    entityType: ActivityType.VIDEO,
    action: 'liked',
    videoId,
    metadata: { content_type: 'video', link: `/glimpse/${bunny_video_id}` },
  });

  if (relatedUserId && relatedUserId !== userId) {
    await createNotification({
      recipient_user_id: relatedUserId,
      actor_id: userId,
      type: 'video_liked',
      entity_id: videoId,
      metadata: { content_type: 'video', link: `/glimpse/${bunny_video_id}` },
    });
  }

  revalidatePath('/videos', 'page');
  revalidatePath('/explore', 'page');
  revalidatePath('/collections', 'page');

  return { success: true, data };
}

export async function unlikeVideoAction(userId: string, videoId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('video_likes')
    .delete()
    .eq('user_id', userId)
    .eq('video_id', videoId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/reflections', 'page');

  return { success: true };
}

// Function to fetch if a user has liked a video (for initial state)
export async function fetchUserVideoLike(userId: string, videoId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('video_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 means "No rows found"
    throw new Error(`Failed to fetch like status: ${error.message}`);
  }
  return !!data; // Returns true if a like exists, false otherwise
}

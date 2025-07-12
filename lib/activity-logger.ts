'use server';

import { createClient } from '@/utils/supabase/server';
import { ActionType } from '@/types/activity';
import { updateReputation } from './actions/reputation.action';
//import { headers } from 'next/headers';

type ActivityEntityType =
  | 'post'
  | 'comment'
  | 'vote'
  | 'report'
  | 'profile'
  | 'system'
  | 'view'
  | 'video';

interface ActivityLogParams {
  userId: string;
  relatedUserId?: string | null;
  entityType: ActivityEntityType;
  action: ActionType;
  postId?: string;
  commentId?: number;
  voteId?: number;
  reportId?: number;
  profileId?: string;
  videoId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

export async function logActivity({
  userId,
  relatedUserId,
  entityType,
  action,
  postId,
  commentId,
  voteId,
  reportId,
  profileId,
  videoId,
  metadata = {},
}: ActivityLogParams) {
  const supabase = await createClient();

  try {
    // Get IP address from headers
    //const headersList = headers();
    const ip = null;
    if(userId === relatedUserId){
      relatedUserId = null;
    }

    const { error } = await supabase.from('activity_logs').insert({
      user_id: userId,
      related_user_id: relatedUserId,
      entity_type: entityType,
      action,
      post_id: postId,
      comment_id: commentId,
      vote_id: voteId,
      report_id: reportId,
      profile_id: profileId,
      video_id: videoId,
      metadata,
      ip_address: ip || null,
    });

    if (error) {
      console.error('Failed to log activity:', error);
      return;
    }

    const params = {
      interaction: { action, entityType },
      performerId: userId,
      authorId: relatedUserId,
      metadata: metadata,
    };
    await updateReputation(params);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

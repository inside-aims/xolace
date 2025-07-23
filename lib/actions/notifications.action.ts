"use server"

import { createClient } from "@/utils/supabase/server";

/*new_upvote, new_downvote, new_comment, post_saved, video_saved, video_liked, system_announcement, post_viewed */
export async function createNotification(payload: {
    recipient_user_id: string;
    actor_id: string | null;
    type: 'new_upvote' | 'video_saved' | 'new_comment' | 'post_viewed' | 'post_saved' | 'video_liked' | 'system_announcement' | 'new_downvote' | 'comment_reply' // etc.
    entity_id: string;
    metadata?: object;
}) {
    const supabase = await createClient();
    await supabase.from('notifications').insert([payload]);
}
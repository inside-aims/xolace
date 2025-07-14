"use server"

import { createClient } from "@/utils/supabase/server";


export async function createNotification(payload: {
    recipient_user_id: string;
    actor_id: string;
    type: 'new_upvote' | 'video_saved' | 'new_comment' // etc.
    entity_id: string;
    metadata?: object;
}) {
    const supabase = await createClient();
    await supabase.from('notifications').insert([payload]);
}
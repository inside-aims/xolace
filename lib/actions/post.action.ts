import {cache} from 'react';
import { createClient } from '@/utils/supabase/server';

export const getPostMetadata = cache(async (postId: string)  => {
    const supabase = await createClient();
    const { data: post, error } = await supabase
        .from('posts')
        .select(
            `
            author_name, content
        `
        )
        .eq('id', postId)
        .single();

        if (error) return { author_name: "Post", content: "" };
    return post;
});
    
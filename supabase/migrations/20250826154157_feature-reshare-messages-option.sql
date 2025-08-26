drop trigger if exists "tr_posts_autoset_author_name" on "public"."posts";

drop function if exists "public"."create_post_with_tags"(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, is_sensitive boolean, is_prompt_response boolean, type post_type, tag_names text[], slide_contents text[], campfire_id uuid, daily_prompt_id uuid);

alter table "public"."anonymous_messages" add column "can_reshare" boolean not null default true;

alter table "public"."posts" add column "is_reshared_anon_meg" boolean not null default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_post_with_tags(content text, mood post_mood, expires_in_24hr boolean, duration post_duration DEFAULT NULL::post_duration, expires_at timestamp with time zone DEFAULT NULL::timestamp with time zone, is_sensitive boolean DEFAULT false, is_prompt_response boolean DEFAULT false, type post_type DEFAULT 'single'::post_type, tag_names text[] DEFAULT NULL::text[], slide_contents text[] DEFAULT NULL::text[], campfire_id uuid DEFAULT NULL::uuid, daily_prompt_id uuid DEFAULT NULL::uuid, is_reshared_anon_meg boolean DEFAULT false)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
    post_id UUID;
    tag_id BIGINT;
    tag_name TEXT;
    slide_content TEXT;
    i INTEGER := 1;
BEGIN
    -- Insert the post, including daily_prompt_id if provided
    INSERT INTO public.posts (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive,
        is_prompt_response,
        type,
        campfire_id,
        daily_prompt_id,   -- ✅ added
        is_reshared_anon_meg -- new
    )
    VALUES (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive,
        is_prompt_response,
        type,
        campfire_id,
        daily_prompt_id,   -- ✅ added
        is_reshared_anon_meg -- new
    )
    RETURNING id INTO post_id;

    -- Process and attach tags if provided
    IF tag_names IS NOT NULL AND array_length(tag_names, 1) > 0 THEN
        FOREACH tag_name IN ARRAY tag_names LOOP
            -- Get or create tag
            INSERT INTO public.tags (name, post)
            VALUES (tag_name, 1)
            ON CONFLICT (name) DO UPDATE
                SET post = tags.post + 1
            RETURNING id INTO tag_id;

            -- Link tag to post
            INSERT INTO public.posttags (tag, post)
            VALUES (tag_id, post_id)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;

    -- If it's a carousel post, save slides
    IF type = 'carousel' AND slide_contents IS NOT NULL AND array_length(slide_contents, 1) > 0 THEN
        FOREACH slide_content IN ARRAY slide_contents LOOP
            INSERT INTO public.post_slides (post_id, slide_index, content)
            VALUES (post_id, i - 1, slide_content);
            i := i + 1;
        END LOOP;
    END IF;

    RETURN post_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to create post: %', SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_post_with_tags_v7(content text, mood post_mood, expires_in_24hr boolean, duration post_duration DEFAULT NULL::post_duration, expires_at timestamp with time zone DEFAULT NULL::timestamp with time zone, is_sensitive boolean DEFAULT false, is_prompt_response boolean DEFAULT false, type post_type DEFAULT 'single'::post_type, tag_names text[] DEFAULT NULL::text[], slide_contents text[] DEFAULT NULL::text[], campfire_id uuid DEFAULT NULL::uuid, daily_prompt_id uuid DEFAULT NULL::uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$DECLARE
    post_id UUID;
    tag_id BIGINT;
    tag_name TEXT;
    slide_content TEXT;
    i INTEGER := 1;
BEGIN
    -- Insert the post, including daily_prompt_id if provided
    INSERT INTO public.posts (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive,
        is_prompt_response,
        type,
        campfire_id,
        daily_prompt_id   -- ✅ added
    )
    VALUES (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive,
        is_prompt_response,
        type,
        campfire_id,
        daily_prompt_id   -- ✅ added
    )
    RETURNING id INTO post_id;

    -- Process and attach tags if provided
    IF tag_names IS NOT NULL AND array_length(tag_names, 1) > 0 THEN
        FOREACH tag_name IN ARRAY tag_names LOOP
            -- Get or create tag
            INSERT INTO public.tags (name, post)
            VALUES (tag_name, 1)
            ON CONFLICT (name) DO UPDATE
                SET post = tags.post + 1
            RETURNING id INTO tag_id;

            -- Link tag to post
            INSERT INTO public.posttags (tag, post)
            VALUES (tag_id, post_id)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;

    -- If it's a carousel post, save slides
    IF type = 'carousel' AND slide_contents IS NOT NULL AND array_length(slide_contents, 1) > 0 THEN
        FOREACH slide_content IN ARRAY slide_contents LOOP
            INSERT INTO public.post_slides (post_id, slide_index, content)
            VALUES (post_id, i - 1, slide_content);
            i := i + 1;
        END LOOP;
    END IF;

    RETURN post_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to create post: %', SQLERRM;
END;$function$
;

CREATE OR REPLACE FUNCTION public.set_posts_author_info()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$BEGIN
    -- Check if this is an anonymous reshared message
    IF NEW.is_reshared_anon_meg = true THEN
        NEW.author_name = 'anonymous';
        NEW.author_avatar_url = 'https://qdjrwasidlmgqxakdxkl.supabase.co/storage/v1/object/public/xolace.bucket/sad-anonymous.png';
    ELSE
        -- Use the regular profile data
        NEW.author_name = (SELECT username FROM public.profiles WHERE supabase_user = auth.uid());
        NEW.author_avatar_url = (SELECT avatar_url FROM public.profiles WHERE supabase_user = auth.uid());
    END IF;
    
    RETURN NEW;
END;$function$
;

CREATE TRIGGER tr_posts_autoset_author_name BEFORE INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION set_posts_author_info();




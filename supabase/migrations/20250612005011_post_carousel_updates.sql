create type "public"."post_type" as enum ('single', 'carousel');

drop function if exists "public"."create_post_with_tags"(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, tag_names text[], is_sensitive boolean, is_prompt_response boolean);

alter table "public"."posts" alter column "mood" drop default;

alter type "public"."post_mood" rename to "post_mood__old_version_to_be_dropped";

create type "public"."post_mood" as enum ('neutral', 'confused', 'sad', 'happy', 'angry', 'thoughtful', 'chill', 'grateful', 'laughing', 'inspired', 'peaceful', 'melancholy', 'creative', 'nostalgic', 'motivated', 'excited', 'energetic');

create table "public"."post_slides" (
    "id" uuid not null default gen_random_uuid(),
    "post_id" uuid not null,
    "slide_index" integer not null,
    "content" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."post_slides" enable row level security;

alter table "public"."posts" alter column mood type "public"."post_mood" using mood::text::"public"."post_mood";

alter table "public"."posts" alter column "mood" set default 'neutral'::post_mood;

alter table "public"."health_tips" alter column "slug" set not null;

alter table "public"."posts" add column "type" post_type not null default 'single'::post_type;

CREATE INDEX idx_post_slides_post_id ON public.post_slides USING btree (post_id);

CREATE UNIQUE INDEX post_slides_pkey ON public.post_slides USING btree (id);

alter table "public"."post_slides" add constraint "post_slides_pkey" PRIMARY KEY using index "post_slides_pkey";

alter table "public"."post_slides" add constraint "post_slides_content_max_length_check" CHECK ((length(content) <= 500)) not valid;

alter table "public"."post_slides" validate constraint "post_slides_content_max_length_check";

alter table "public"."post_slides" add constraint "post_slides_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE not valid;

alter table "public"."post_slides" validate constraint "post_slides_post_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_post_with_tags(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, is_sensitive boolean, is_prompt_response boolean, type post_type, tag_names text[] DEFAULT NULL::text[], slide_contents text[] DEFAULT NULL::text[])
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
    post_id UUID;
    tag_id BIGINT;
    tag_name TEXT;
    slide_content TEXT;
    i INTEGER := 1;
BEGIN
    -- Insert the post
    INSERT INTO posts (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive,
        is_prompt_response,
        type
    )
    VALUES (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive,
        is_prompt_response,
        type
    )
    RETURNING id INTO post_id;

    -- Process and attach tags if provided
    IF tag_names IS NOT NULL AND array_length(tag_names, 1) > 0 THEN
        FOREACH tag_name IN ARRAY tag_names LOOP
            -- Get or create tag
            INSERT INTO tags (name, post)
            VALUES (tag_name, 1)
            ON CONFLICT (name) DO UPDATE
            SET post = tags.post + 1
            RETURNING id INTO tag_id;

            -- Link tag to post
            INSERT INTO posttags (tag, post)
            VALUES (tag_id, post_id)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;

    -- If it's a carousel post, save slides
    IF type = 'carousel' AND slide_contents IS NOT NULL AND array_length(slide_contents, 1) > 0 THEN
        FOREACH slide_content IN ARRAY slide_contents LOOP
            INSERT INTO post_slides (post_id, slide_index, content)
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

CREATE OR REPLACE FUNCTION public.create_post_with_tags_v3(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, tag_names text[], is_sensitive boolean DEFAULT false, is_prompt_response boolean DEFAULT false)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
    post_id UUID;
    tag_id BIGINT;
    tag_name TEXT;
BEGIN
    -- Insert the post
    INSERT INTO posts (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive,
        is_prompt_response
    )
    VALUES (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive,
        is_prompt_response
    )
    RETURNING id INTO post_id;

    -- Process and attach tags if provided
    IF array_length(tag_names, 1) > 0 THEN
        FOREACH tag_name IN ARRAY tag_names LOOP
            -- Insert new tag or update usage count if exists
            INSERT INTO tags (name, post)
            VALUES (tag_name, 1)
            ON CONFLICT (name) DO UPDATE
            SET post = tags.post + 1
            RETURNING id INTO tag_id;

            -- Link tag to post
            INSERT INTO posttags (tag, post)
            VALUES (tag_id, post_id);
        END LOOP;
    END IF;

    RETURN post_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Transaction failed: %', SQLERRM;
        RETURN NULL;
END;$function$
;

CREATE OR REPLACE FUNCTION public.create_post_with_tags_v4(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, is_sensitive boolean, is_prompt_response boolean, tag_names text[], type post_type)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
    post_id UUID;
    tag_id BIGINT;
    tag_name TEXT;
BEGIN
    -- Insert the post
    INSERT INTO posts (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive,
        is_prompt_response,
        type
    )
    VALUES (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive,
        is_prompt_response,
        type
    )
    RETURNING id INTO post_id;

    -- Process and attach tags if provided
    IF array_length(tag_names, 1) > 0 THEN
        FOREACH tag_name IN ARRAY tag_names LOOP
            -- Insert new tag or update usage count if exists
            INSERT INTO tags (name, post)
            VALUES (tag_name, 1)
            ON CONFLICT (name) DO UPDATE
            SET post = tags.post + 1
            RETURNING id INTO tag_id;

            -- Link tag to post
            INSERT INTO posttags (tag, post)
            VALUES (tag_id, post_id);
        END LOOP;
    END IF;

    RETURN post_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Transaction failed: %', SQLERRM;
        RETURN NULL;
END;$function$
;

grant delete on table "public"."post_slides" to "anon";

grant insert on table "public"."post_slides" to "anon";

grant references on table "public"."post_slides" to "anon";

grant select on table "public"."post_slides" to "anon";

grant trigger on table "public"."post_slides" to "anon";

grant truncate on table "public"."post_slides" to "anon";

grant update on table "public"."post_slides" to "anon";

grant delete on table "public"."post_slides" to "authenticated";

grant insert on table "public"."post_slides" to "authenticated";

grant references on table "public"."post_slides" to "authenticated";

grant select on table "public"."post_slides" to "authenticated";

grant trigger on table "public"."post_slides" to "authenticated";

grant truncate on table "public"."post_slides" to "authenticated";

grant update on table "public"."post_slides" to "authenticated";

grant delete on table "public"."post_slides" to "service_role";

grant insert on table "public"."post_slides" to "service_role";

grant references on table "public"."post_slides" to "service_role";

grant select on table "public"."post_slides" to "service_role";

grant trigger on table "public"."post_slides" to "service_role";

grant truncate on table "public"."post_slides" to "service_role";

grant update on table "public"."post_slides" to "service_role";


create policy "Enable insert for authenticated users only"
on "public"."post_slides"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all authenticatedusers"
on "public"."post_slides"
as permissive
for select
to authenticated
using (true);





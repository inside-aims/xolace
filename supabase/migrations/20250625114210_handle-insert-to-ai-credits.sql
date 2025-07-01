alter table "public"."feedbacks" drop constraint "feedbacks_created_by_fkey";

alter table "public"."reports" drop constraint "reports_comment_id_fkey";

alter table "public"."reports" drop constraint "reports_post_id_fkey";

drop function if exists "public"."create_post_with_tags_v1"(content text, mood post_mood__old_version_to_be_dropped, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, tag_names text[]);

drop function if exists "public"."create_post_with_tags_v2"(content text, mood post_mood__old_version_to_be_dropped, expires_in_24hr boolean, duration post_duration, expires_at timestamp without time zone, tag_names text[], is_sensitive boolean);

drop type "public"."post_mood__old_version_to_be_dropped";

alter table "public"."feedbacks" add constraint "feedbacks_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET DEFAULT not valid;

alter table "public"."feedbacks" validate constraint "feedbacks_created_by_fkey";

alter table "public"."reports" add constraint "reports_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reports" validate constraint "reports_comment_id_fkey";

alter table "public"."reports" add constraint "reports_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reports" validate constraint "reports_post_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_post_with_tags_v1(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, tag_names text[])
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
    post_id uuid;
    tag_id bigint;
    tag_name text;
BEGIN
    -- Start a transaction
    RAISE NOTICE 'Starting to create post with content: %', content;

    -- Insert the post
    INSERT INTO Posts (content, mood, expires_in_24hr, duration, expires_at)
    VALUES (content, mood, expires_in_24hr, duration, expires_at)
    RETURNING id INTO post_id;

    RAISE NOTICE 'Post created with ID: %', post_id;

     -- Process tags if any
    IF array_length(tag_names, 1) > 0 THEN
     FOREACH tag_name IN ARRAY tag_names
     LOOP
        -- Check if the tag already exists
        INSERT INTO Tags (name, post)
        VALUES (tag_name, 1)
        ON CONFLICT (name)
        DO UPDATE SET post = Tags.post + 1
        RETURNING id INTO tag_id;

        -- Insert into PostTags
        INSERT INTO PostTags (tag, post) VALUES (tag_id, post_id);
        RAISE NOTICE 'PostTag created for post_id: % and tag_id: %', post_id, tag_id;
     END LOOP;
    END IF;

    -- Return the post_id
    RETURN post_id;

EXCEPTION 
    WHEN OTHERS THEN
        -- Rollback transaction in case of error
        RAISE NOTICE 'Transaction failed: %', SQLERRM;
        RETURN NULL;
END;$function$
;

CREATE OR REPLACE FUNCTION public.create_post_with_tags_v2(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp without time zone, tag_names text[], is_sensitive boolean)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
    post_id UUID;
    tag_id BIGINT;
    tag_name TEXT;
BEGIN
    -- Insert the post
    INSERT INTO Posts (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive  -- 🔥 New Column
    )
    VALUES (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive
    )
    RETURNING id INTO post_id;

    -- Process tags if any
    IF array_length(tag_names, 1) > 0 THEN
        FOREACH tag_name IN ARRAY tag_names LOOP
            -- Insert or update tag usage
            INSERT INTO Tags (name, post)
            VALUES (tag_name, 1)
            ON CONFLICT (name) DO UPDATE
            SET post = Tags.post + 1
            RETURNING id INTO tag_id;

            -- Link tag to the post
            INSERT INTO PostTags (tag, post)
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

CREATE OR REPLACE FUNCTION public.handle_ai_credit_insert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  is_anon BOOLEAN;
BEGIN
  SELECT is_anonymous INTO is_anon
  FROM public.profiles
  WHERE supabase_user = NEW.supabase_user;

  IF is_anon IS FALSE THEN
    INSERT INTO ai_credits (user_id, credits_remaining)
    VALUES (NEW.id, 5);
  END IF;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_author_name_and_author_avatar()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW.author_name = (SELECT username FROM profiles WHERE supabase_user = auth.uid());
  NEW.author_avatar_url = (SELECT avatar_url FROM profiles WHERE supabase_user = auth.uid());
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.set_reported_by_value()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW.reported_by = ( SELECT id FROM profiles WHERE supabase_user = auth.uid());
  RETURN NEW;
END;$function$
;

CREATE TRIGGER after_profile_insert AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION handle_ai_credit_insert();


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION rls_helpers.is_same_user(profile_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN (
    EXISTS (
      SELECT FROM profiles WHERE id=profile_id AND supabase_user = auth.uid()
    )
  );
END;$function$
;




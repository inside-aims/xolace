create type "public"."action_type" as enum ('created', 'deleted', 'updated', 'commented', 'reported', 'upvoted', 'downvoted', 'viewed', 'added');

create type "public"."entity_types" as enum ('post', 'comment', 'vote', 'report', 'profile', 'system', 'view');

drop function if exists "public"."handle_vote"(p_post_id uuid, p_user_id uuid, p_vote_type vote_types, p_current_vote text);
drop function if exists "public"."create_post_with_tags"(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, tag_names text[]);

create table "public"."activity_logs" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "related_user_id" uuid,
    "post_id" uuid,
    "comment_id" bigint,
    "vote_id" bigint,
    "report_id" bigint,
    "profile_id" uuid,
    "action" action_type not null,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "ip_address" inet,
    "entity_type" entity_types not null
);


alter table "public"."activity_logs" enable row level security;

CREATE UNIQUE INDEX activity_logs_pkey ON public.activity_logs USING btree (id);

CREATE INDEX idx_activity_logs_comment ON public.activity_logs USING btree (comment_id) WHERE (comment_id IS NOT NULL);

CREATE INDEX idx_activity_logs_created_at ON public.activity_logs USING btree (created_at DESC);

CREATE INDEX idx_activity_logs_post ON public.activity_logs USING btree (post_id) WHERE (post_id IS NOT NULL);

CREATE INDEX idx_activity_logs_related_user ON public.activity_logs USING btree (related_user_id);

CREATE INDEX idx_activity_logs_user ON public.activity_logs USING btree (user_id);

CREATE INDEX idx_activity_logs_user_created ON public.activity_logs USING btree (user_id, created_at DESC);

CREATE INDEX idx_activity_logs_vote ON public.activity_logs USING btree (vote_id) WHERE (vote_id IS NOT NULL);

alter table "public"."activity_logs" add constraint "activity_logs_pkey" PRIMARY KEY using index "activity_logs_pkey";

alter table "public"."activity_logs" add constraint "activity_logs_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE SET NULL not valid;

alter table "public"."activity_logs" validate constraint "activity_logs_comment_id_fkey";

alter table "public"."activity_logs" add constraint "activity_logs_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL not valid;

alter table "public"."activity_logs" validate constraint "activity_logs_post_id_fkey";

alter table "public"."activity_logs" add constraint "activity_logs_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."activity_logs" validate constraint "activity_logs_profile_id_fkey";

alter table "public"."activity_logs" add constraint "activity_logs_related_user_id_fkey" FOREIGN KEY (related_user_id) REFERENCES profiles(id) ON DELETE SET NULL not valid;

alter table "public"."activity_logs" validate constraint "activity_logs_related_user_id_fkey";

alter table "public"."activity_logs" add constraint "activity_logs_report_id_fkey" FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE not valid;

alter table "public"."activity_logs" validate constraint "activity_logs_report_id_fkey";

alter table "public"."activity_logs" add constraint "activity_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."activity_logs" validate constraint "activity_logs_user_id_fkey";

alter table "public"."activity_logs" add constraint "activity_logs_vote_id_fkey" FOREIGN KEY (vote_id) REFERENCES votes(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."activity_logs" validate constraint "activity_logs_vote_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_vote(p_current_vote vote_types, p_post_id uuid, p_user_id uuid, p_vote_type vote_types)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_result json;
  v_vote_id bigint;
  v_vote_data json;
BEGIN
  -- Start transaction
  BEGIN
    -- Remove existing vote if exists
    IF p_current_vote IS NOT NULL THEN
      -- Delete the existing vote and capture its ID
      DELETE FROM votes
      WHERE post_id = p_post_id
      AND user_id = p_user_id
      RETURNING id INTO v_vote_id;
      
      -- Update post vote counts (decrement previous vote)
      IF p_current_vote::vote_types = 'upvote' THEN
        UPDATE posts
        SET upvotes = upvotes - 1
        WHERE id = p_post_id;
      ELSIF p_current_vote::vote_types = 'downvote' THEN
        UPDATE posts
        SET downvotes = downvotes - 1
        WHERE id = p_post_id;
      END IF;
    END IF;

    -- If the new vote is different from the current vote
    IF p_current_vote IS NULL OR p_current_vote::vote_types != p_vote_type THEN
      -- Insert new vote and capture the vote data
      INSERT INTO votes (post_id, user_id, vote_type)
      VALUES (p_post_id, p_user_id, p_vote_type)
      RETURNING 
        id,
        post_id,
        user_id,
        vote_type,
        created_at
      INTO v_vote_data;
      
      -- Update post vote counts (increment new vote)
      IF p_vote_type = 'upvote' THEN
        UPDATE posts
        SET upvotes = upvotes + 1
        WHERE id = p_post_id;
      ELSIF p_vote_type = 'downvote' THEN
        UPDATE posts
        SET downvotes = downvotes + 1
        WHERE id = p_post_id;
      END IF;
    ELSE
      -- If vote was removed (not replaced), set vote_data to null
      v_vote_data := NULL;
    END IF;

    -- Get updated post data and include vote information
    SELECT json_build_object(
      'success', true,
      'post', row_to_json(p),
      'vote', CASE 
        WHEN v_vote_data IS NOT NULL THEN to_json(v_vote_data)
        ELSE NULL
      END,
      'action', CASE
        WHEN p_current_vote IS NULL THEN 'added'
        WHEN p_current_vote::vote_types != p_vote_type THEN 'changed'
        ELSE 'removed'
      END
    ) INTO v_result
    FROM posts p
    WHERE id = p_post_id;
    
    RETURN v_result;
  EXCEPTION
    WHEN OTHERS THEN
      -- Roll back transaction on error
      RETURN json_build_object(
        'success', false,
        'error', SQLERRM,
        'message', 'Failed to process vote'
      );
  END;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_post_with_tags(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, tag_names text[])
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
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
END;
$function$
;

grant delete on table "public"."activity_logs" to "anon";

grant insert on table "public"."activity_logs" to "anon";

grant references on table "public"."activity_logs" to "anon";

grant select on table "public"."activity_logs" to "anon";

grant trigger on table "public"."activity_logs" to "anon";

grant truncate on table "public"."activity_logs" to "anon";

grant update on table "public"."activity_logs" to "anon";

grant delete on table "public"."activity_logs" to "authenticated";

grant insert on table "public"."activity_logs" to "authenticated";

grant references on table "public"."activity_logs" to "authenticated";

grant select on table "public"."activity_logs" to "authenticated";

grant trigger on table "public"."activity_logs" to "authenticated";

grant truncate on table "public"."activity_logs" to "authenticated";

grant update on table "public"."activity_logs" to "authenticated";

grant delete on table "public"."activity_logs" to "service_role";

grant insert on table "public"."activity_logs" to "service_role";

grant references on table "public"."activity_logs" to "service_role";

grant select on table "public"."activity_logs" to "service_role";

grant trigger on table "public"."activity_logs" to "service_role";

grant truncate on table "public"."activity_logs" to "service_role";

grant update on table "public"."activity_logs" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."activity_logs"
as permissive
for insert
to authenticated
with check (true);


create policy "View own activities"
on "public"."activity_logs"
as permissive
for select
to public
using (((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = auth.uid()) AND (profiles.id = activity_logs.user_id)))) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = auth.uid()) AND (profiles.id = activity_logs.related_user_id))))));


create policy "Update post for all users"
on "public"."posts"
as permissive
for update
to authenticated
using (true)
with check (true);





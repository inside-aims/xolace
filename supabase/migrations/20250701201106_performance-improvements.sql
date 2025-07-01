drop policy "Allow delete for blue team" on "public"."comments";

drop policy "allow to delete comment if has created" on "public"."comments";

drop policy "Allow delete for blue team" on "public"."posts";

drop policy "allow delete for user who created post" on "public"."posts";

drop policy "Enable read access for all authenticated users" on "public"."profiles";

drop policy "Enable update for all users" on "public"."profiles";

drop policy "Allow user to access only his own preference " on "public"."user_preferences";

drop policy "View own activities" on "public"."activity_logs";

drop policy "Enable users to view their own data only" on "public"."collections";

drop policy "Enable update for users based on anonymous claim" on "public"."profiles";

drop policy "Enable delete for users based on user_id" on "public"."votes";

alter table "public"."prompt_streaks" drop constraint "prompt_streaks_user_id_key";

drop index if exists "public"."prompt_streaks_user_id_key";

alter table "public"."activity_logs" add column "related_user_avatar_url" text;

alter table "public"."activity_logs" add column "related_username" text;

alter table "public"."activity_logs" add column "user_avatar_url" text;

alter table "public"."activity_logs" add column "username" text;

alter table "public"."activity_logs" alter column "user_id" set not null;

alter table "public"."feedbacks" alter column "created_by" set not null;

alter table "public"."user_preferences" alter column "daily_prompt_enabled" set default true;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_activity_user_info()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  -- Set username and user_avatar_url from user_id
  if NEW.user_id is not null then
    select username, avatar_url
    into NEW.username, NEW.user_avatar_url
    from public.profiles
    where id = NEW.user_id;
  end if;

  -- Set related_username and related_user_avatar_url from related_user_id
  if NEW.related_user_id is not null then
    select username, avatar_url
    into NEW.related_username, NEW.related_user_avatar_url
    from public.profiles
    where id = NEW.related_user_id;
  end if;

  return NEW;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_post_with_tags(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, is_sensitive boolean, is_prompt_response boolean, type post_type, tag_names text[] DEFAULT NULL::text[], slide_contents text[] DEFAULT NULL::text[])
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
    -- Insert the post
    INSERT INTO public.posts (
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

create policy "Allow delete for blue team or creator"
on "public"."comments"
as permissive
for delete
to authenticated
using ((rls_helpers.is_same_user(created_by) OR rls_helpers.rls_can_delete_blue_team()));


create policy "Allow delete for blue team or creator"
on "public"."posts"
as permissive
for delete
to authenticated
using ((rls_helpers.is_same_user(created_by) OR rls_helpers.rls_can_delete_blue_team()));


create policy "Allow user to access only his own preference"
on "public"."user_preferences"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.id = user_preferences.user_id)))));


create policy "View own activities"
on "public"."activity_logs"
as permissive
for select
to authenticated
using (rls_helpers.can_view_activity(user_id, related_user_id));


create policy "Enable users to view their own data only"
on "public"."collections"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.id = collections.user_id)))));


create policy "Enable update for users based on anonymous claim"
on "public"."profiles"
as restrictive
for update
to authenticated
using ((((( SELECT auth.jwt() AS jwt) ->> 'is_anonymous'::text))::boolean IS FALSE))
with check ((((( SELECT auth.jwt() AS jwt) ->> 'is_anonymous'::text))::boolean IS FALSE));


create policy "Enable delete for users based on user_id"
on "public"."votes"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.id = votes.user_id)))));


CREATE TRIGGER tr_set_activity_user_info BEFORE INSERT OR UPDATE OF user_id, related_user_id ON public.activity_logs FOR EACH ROW EXECUTE FUNCTION set_activity_user_info();


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION rls_helpers.can_view_activity(log_user_id uuid, log_related_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
DECLARE
  current_user_profile_id uuid;
BEGIN
  -- Get the profile ID of the currently authenticated user once
  SELECT id INTO current_user_profile_id
  FROM public.profiles
  WHERE supabase_user = auth.uid();

  -- Return true if the current user is either the main user or the related user
  RETURN (current_user_profile_id = log_user_id OR current_user_profile_id = log_related_user_id);
END;
$function$
;

CREATE OR REPLACE FUNCTION rls_helpers.rls_can_delete_blue_team()
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
begin
  return exists (
    select 1
    from user_roles
    join profiles on profiles.id = user_roles.user_id
    where profiles.supabase_user = auth.uid()
      and user_roles.role = 'blue_team'
  );
end;
$function$
;




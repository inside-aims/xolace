create type "public"."comment_pin_type" as enum ('none', 'author', 'professional');

drop policy "allow to update user created it" on "public"."comments";

drop policy "Enable insert for authenticated users only" on "public"."health_tips";

drop policy "Users can view their own roles, mods see all" on "public"."user_roles";

alter table "public"."comments" add column "pinned_status" comment_pin_type not null default 'none'::comment_pin_type;

alter table "public"."user_roles" enable row level security;

CREATE INDEX idx_comments_pinned_status ON public.comments USING btree (post, pinned_status) WHERE (pinned_status <> 'none'::comment_pin_type);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.pin_comment(comment_id_to_pin bigint, pin_level comment_pin_type)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  caller_profile_id uuid; -- Correct variable for the user's profile ID
  caller_role public.user_role;
  target_post_id uuid;
  post_author_id uuid;
  current_pin_status public.comment_pin_type;
BEGIN
  -- 1. Get the caller's profile ID using auth.uid() to look up in the profiles table.
  -- This is the crucial correction.
  SELECT id INTO caller_profile_id 
  FROM public.profiles 
  WHERE supabase_user = auth.uid();

  IF caller_profile_id IS NULL THEN
    RAISE EXCEPTION 'Caller profile not found.';
  END IF;

  -- 2. Get information about the target comment and its post
  SELECT c.post, p.created_by, c.pinned_status 
  INTO target_post_id, post_author_id, current_pin_status
  FROM public.comments c
  JOIN public.posts p ON c.post = p.id
  WHERE c.id = comment_id_to_pin;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Comment not found.';
  END IF;

  -- 3. Check permissions using the correct caller_profile_id
  IF pin_level = 'author' AND caller_profile_id <> post_author_id THEN
    RAISE EXCEPTION 'Only the post author can pin this comment.';
  ELSIF pin_level = 'professional' THEN
    SELECT role INTO caller_role FROM public.profiles WHERE id = caller_profile_id;
    IF caller_role <> 'help_professional' THEN
      RAISE EXCEPTION 'Only a verified health professional can pin this comment.';
    END IF;
  END IF;

  -- 4. Unpin the existing comment if it's already pinned with the same level
  IF current_pin_status = pin_level THEN
    UPDATE public.comments SET pinned_status = 'none' WHERE id = comment_id_to_pin;
    RETURN;
  END IF;

  -- 5. Before pinning, unpin any other comment of the same pin_level on this post
  UPDATE public.comments
  SET pinned_status = 'none'
  WHERE post = target_post_id AND pinned_status = pin_level;

  -- 6. Pin the new comment
  UPDATE public.comments
  SET pinned_status = pin_level
  WHERE id = comment_id_to_pin;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_comments_with_replies(post_id_param uuid)
 RETURNS SETOF comments
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  WITH RECURSIVE comment_tree AS (

    -- Base case: Select top-level comments (those with no parent)

    SELECT *

    FROM public.comments

    WHERE post = post_id_param AND parent_id IS NULL



    UNION ALL



    -- Recursive step: Find all replies to the comments already in our tree

    SELECT c.*

    FROM public.comments c

    JOIN comment_tree ct ON c.parent_id = ct.id

  )

  SELECT * FROM comment_tree

  ORDER BY

    CASE pinned_status

      WHEN 'professional' THEN 1 -- Professional pins come first

      WHEN 'author' THEN 2       -- Author pins come second

      ELSE 3                     -- Everything else comes third

    END,

    created_at DESC; -- Then sort by newest within each group

END;

$function$
;

create policy "allow to update user created it"
on "public"."comments"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."health_tips"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'help_professional'::user_role)))));


create policy "Users can view their own roles, mods see all"
on "public"."user_roles"
as permissive
for select
to public
using (((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.supabase_user = ( SELECT auth.uid() AS uid)))) OR (( SELECT profiles.role
   FROM profiles
  WHERE (profiles.supabase_user = ( SELECT auth.uid() AS uid))) = 'blue_team'::user_role)));





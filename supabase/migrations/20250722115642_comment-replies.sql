alter type "public"."notification_type" rename to "notification_type__old_version_to_be_dropped";

create type "public"."notification_type" as enum ('new_upvote', 'new_downvote', 'new_comment', 'post_saved', 'video_saved', 'video_liked', 'system_announcement', 'post_viewed', 'comment_reply');

alter table "public"."notifications" alter column type type "public"."notification_type" using type::text::"public"."notification_type";

drop type "public"."notification_type__old_version_to_be_dropped";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_comments_with_replies(post_id_param uuid)
 RETURNS SETOF comments
 LANGUAGE plpgsql
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
  ORDER BY created_at DESC; -- Order by creation time to maintain chronological order
END;
$function$
;




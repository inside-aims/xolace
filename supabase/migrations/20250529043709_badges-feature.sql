CREATE INDEX idx_comments_created_by ON public.comments USING btree (created_by);

CREATE INDEX idx_posts_created_by ON public.posts USING btree (created_by);

CREATE INDEX idx_views_post_user ON public.views USING btree (post_id, user_id);

CREATE INDEX idx_votes_post_user ON public.votes USING btree (post_id, user_id);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_stats(profile_id uuid)
 RETURNS TABLE(total_posts bigint, total_comments bigint, total_upvotes bigint, total_views bigint, total_downvotes bigint)
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN QUERY 
  WITH 
    post_stats AS (
      SELECT 
        COUNT(*) AS post_count,
        COALESCE(SUM(upvotes), 0) AS post_upvotes,
        COALESCE(SUM(downvotes), 0) AS post_downvotes
      FROM posts 
      WHERE created_by = profile_id
    ),
    comment_stats AS (
      SELECT COUNT(*) AS comment_count
      FROM comments 
      WHERE created_by = profile_id
    ),
    view_stats AS (
      SELECT COUNT(*) AS view_count
      FROM views 
      WHERE post_id IN (
        SELECT id FROM posts WHERE created_by = profile_id
      )
    )
  SELECT 
    ps.post_count,
    cs.comment_count,
    ps.post_upvotes,
    ps.post_downvotes,
    vs.view_count
  FROM 
    post_stats ps,
    comment_stats cs,
    view_stats vs;
END;$function$
;




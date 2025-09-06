set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_personalized_feed_v2(user_id_param uuid, page_size integer DEFAULT 50, offset_param integer DEFAULT 0)
 RETURNS TABLE(id uuid, created_at timestamp with time zone, created_by uuid, author_name text, content text, mood post_mood, author_avatar_url text, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, downvotes integer, upvotes integer, is_sensitive boolean, is_prompt_response boolean, type post_type, author_roles user_role[], campfire_id uuid, campfire_name text, campfire_slug text, campfire_icon_url text, daily_prompt_id uuid, prompt_text text, prompt_category text, priority_score integer, is_new_post boolean, is_campfire_post boolean, posttags jsonb, comments_count bigint, views_count bigint, collections jsonb, post_slides jsonb)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$DECLARE
  new_post_threshold TIMESTAMPTZ := NOW() - INTERVAL '48 hours';
BEGIN
  RETURN QUERY
  WITH user_campfires AS (
    SELECT cm.campfire_id
    FROM campfire_members cm
    WHERE cm.user_id = user_id_param
  ),
  prioritized_posts AS (
    SELECT
      p.id,
      p.created_at,
      p.created_by,
      p.author_name,
      p.content,
      p.mood,
      p.author_avatar_url,
      p.expires_in_24hr,
      p.duration,
      p.expires_at,
      p.downvotes,
      p.upvotes,
      p.is_sensitive,
      p.is_prompt_response,
      p.type,
      p.author_roles,
      p.campfire_id,
      c.name AS campfire_name,
      c.slug AS campfire_slug,
      c.icon_url AS campfire_icon_url,
      p.daily_prompt_id,
      dp.prompt_text,
      dp.category AS prompt_category,
      CASE
        WHEN p.created_at >= new_post_threshold THEN 1
        WHEN p.campfire_id IS NOT NULL THEN 2
        ELSE 3
      END AS priority_score,
      (p.created_at >= new_post_threshold) AS is_new_post,
      (p.campfire_id IS NOT NULL) AS is_campfire_post
    FROM posts p
    LEFT JOIN campfires c ON p.campfire_id = c.id
    LEFT JOIN daily_prompts dp ON p.daily_prompt_id = dp.id
    WHERE
      (
        p.campfire_id IS NULL
        OR p.campfire_id IN (SELECT uc.campfire_id FROM user_campfires uc)
      )
      AND (p.expires_at IS NULL OR p.expires_at > NOW())
  ),
  posts_with_aggregates AS (
    SELECT
      pp.id,
      pp.created_at,
      pp.created_by,
      pp.author_name,
      pp.content,
      pp.mood,
      pp.author_avatar_url,
      pp.expires_in_24hr,
      pp.duration,
      pp.expires_at,
      pp.downvotes,
      pp.upvotes,
      pp.is_sensitive,
      pp.is_prompt_response,
      pp.type,
      pp.author_roles,
      pp.campfire_id,
      pp.campfire_name,
      pp.campfire_slug,
      pp.campfire_icon_url,
      pp.daily_prompt_id,
      pp.prompt_text,
      pp.prompt_category,
      pp.priority_score,
      pp.is_new_post,
      pp.is_campfire_post,

      -- Tags
      COALESCE(
        (json_agg(DISTINCT jsonb_build_object('name', t.name))
          FILTER (WHERE t.name IS NOT NULL))::jsonb,
        '[]'::jsonb
      ) AS posttags,

      -- Comments count
      COALESCE(comments_agg.count, 0) AS comments_count,

      -- Views count
      COALESCE(views_agg.count, 0) AS views_count,

      -- Collections
      COALESCE(
        (json_agg(DISTINCT jsonb_build_object('user_id', col.user_id))
          FILTER (WHERE col.user_id IS NOT NULL))::jsonb,
        '[]'::jsonb
      ) AS collections,

      -- Slides
      COALESCE(
        (json_agg(
          jsonb_build_object(
            'slide_index', ps.slide_index,
            'content', ps.content
          ) ORDER BY ps.slide_index
        ) FILTER (WHERE ps.slide_index IS NOT NULL))::jsonb,
        '[]'::jsonb
      ) AS post_slides

    FROM prioritized_posts pp
    LEFT JOIN posttags pt ON pp.id = pt.post
    LEFT JOIN tags t ON pt.tag = t.id
    LEFT JOIN (
      SELECT post, COUNT(*) AS count
      FROM comments
      GROUP BY post
    ) comments_agg ON pp.id = comments_agg.post
    LEFT JOIN (
      SELECT post_id, COUNT(*) AS count
      FROM views
      GROUP BY post_id
    ) views_agg ON pp.id = views_agg.post_id
    LEFT JOIN collections col ON pp.id = col.post_id
    LEFT JOIN post_slides ps ON pp.id = ps.post_id
    GROUP BY
      pp.id, pp.created_at, pp.created_by, pp.author_name, pp.content,
      pp.mood, pp.author_avatar_url, pp.expires_in_24hr, pp.duration,
      pp.expires_at, pp.downvotes, pp.upvotes, pp.is_sensitive,
      pp.is_prompt_response, pp.type, pp.author_roles, pp.campfire_id,
      pp.campfire_name, pp.campfire_slug, pp.campfire_icon_url,
      pp.daily_prompt_id, pp.prompt_text, pp.prompt_category,
      pp.priority_score, pp.is_new_post, pp.is_campfire_post,
      comments_agg.count, views_agg.count
  )
  SELECT
    pwa.id,
    pwa.created_at,
    pwa.created_by,
    pwa.author_name,
    pwa.content,
    pwa.mood,
    pwa.author_avatar_url,
    pwa.expires_in_24hr,
    pwa.duration,
    pwa.expires_at,
    pwa.downvotes,
    pwa.upvotes,
    pwa.is_sensitive,
    pwa.is_prompt_response,
    pwa.type,
    pwa.author_roles,
    pwa.campfire_id,
    pwa.campfire_name,
    pwa.campfire_slug,
    pwa.campfire_icon_url,
    pwa.daily_prompt_id,
    pwa.prompt_text,
    pwa.prompt_category,
    pwa.priority_score,
    pwa.is_new_post,
    pwa.is_campfire_post,
    pwa.posttags,
    pwa.comments_count,
    pwa.views_count,
    pwa.collections,
    pwa.post_slides
  FROM posts_with_aggregates pwa
  ORDER BY
    pwa.priority_score ASC,
    pwa.created_at DESC
  LIMIT page_size
  OFFSET offset_param;
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_personalized_feed(user_id_param uuid, page_size integer DEFAULT 50, offset_param integer DEFAULT 0)
 RETURNS TABLE(id uuid, created_at timestamp with time zone, created_by uuid, author_name text, content text, mood post_mood, author_avatar_url text, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, downvotes integer, upvotes integer, is_sensitive boolean, is_prompt_response boolean, type post_type, author_roles user_role[], campfire_id uuid, campfire_name text, campfire_slug text, campfire_icon_url text, daily_prompt_id uuid, prompt_text text, prompt_category text, priority_score integer, is_new_post boolean, is_campfire_post boolean, posttags jsonb, comments_count bigint, views_count bigint, collections jsonb, post_slides jsonb)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
 DECLARE
   new_post_threshold TIMESTAMPTZ := NOW() - INTERVAL '48 hours';
 BEGIN
   RETURN QUERY
   WITH user_campfires AS (
     SELECT cm.campfire_id
     FROM campfire_members cm
     WHERE cm.user_id = user_id_param
   ),
   prioritized_posts AS (
     SELECT
       p.id,
       p.created_at,
       p.created_by,
       p.author_name,
       p.content,
       p.mood,
       p.author_avatar_url,
       p.expires_in_24hr,
       p.duration,
       p.expires_at,
       p.downvotes,
       p.upvotes,
       p.is_sensitive,
       p.is_prompt_response,
       p.type,
       p.author_roles,
       p.campfire_id,
       c.name AS campfire_name,
       c.slug AS campfire_slug,
       c.icon_url AS campfire_icon_url,
       p.daily_prompt_id,
       dp.prompt_text,
       dp.category AS prompt_category,
       CASE
         WHEN p.created_at >= new_post_threshold THEN 1
         WHEN p.campfire_id IS NOT NULL THEN 2
         ELSE 3
       END AS priority_score,
       (p.created_at >= new_post_threshold) AS is_new_post,
       (p.campfire_id IS NOT NULL) AS is_campfire_post
     FROM posts p
     LEFT JOIN campfires c ON p.campfire_id = c.id
     LEFT JOIN daily_prompts dp ON p.daily_prompt_id = dp.id
     WHERE
       (
         p.campfire_id IS NULL
         OR p.campfire_id IN (SELECT uc.campfire_id FROM user_campfires uc)
       )
       AND (p.expires_at IS NULL OR p.expires_at > NOW())
   ),
   post_tags_agg AS (
     SELECT
       pt.post AS post_id,
       jsonb_agg(DISTINCT jsonb_build_object('name', t.name)) AS posttags
     FROM posttags pt
     JOIN tags t ON pt.tag = t.id
     GROUP BY pt.post
   ),
   comments_agg AS (
     SELECT post AS post_id, COUNT(*) AS count
     FROM comments
     GROUP BY post
   ),
   views_agg AS (
     SELECT post_id, COUNT(*) AS count
     FROM views
     GROUP BY post_id
   ),
   collections_agg AS (
     SELECT
       post_id,
       jsonb_agg(DISTINCT jsonb_build_object('user_id', user_id)) AS collections
     FROM collections
     GROUP BY post_id
   ),
   -- **FIX APPLIED HERE**
   slides_agg AS (
     SELECT
       ps.post_id,
       jsonb_agg(
         jsonb_build_object(
           'slide_index', ps.slide_index,
           'content', ps.content -- Prefixed with alias 'ps'
         ) ORDER BY ps.slide_index
       ) AS post_slides
     FROM post_slides ps -- Alias 'ps' is added
     GROUP BY ps.post_id
   )
   -- Final select joining the pre-aggregated data
   SELECT
     pp.id,
     pp.created_at,
     pp.created_by,
     pp.author_name,
     pp.content,
     pp.mood,
     pp.author_avatar_url,
     pp.expires_in_24hr,
     pp.duration,
     pp.expires_at,
     pp.downvotes,
     pp.upvotes,
     pp.is_sensitive,
     pp.is_prompt_response,
     pp.type,
     pp.author_roles,
     pp.campfire_id,
     pp.campfire_name,
     pp.campfire_slug,
     pp.campfire_icon_url,
     pp.daily_prompt_id,
     pp.prompt_text,
     pp.prompt_category,
     pp.priority_score,
     pp.is_new_post,
     pp.is_campfire_post,
     COALESCE(pta.posttags, '[]'::jsonb),
     COALESCE(ca.count, 0),
     COALESCE(va.count, 0),
     COALESCE(cola.collections, '[]'::jsonb),
     COALESCE(sa.post_slides, '[]'::jsonb)
   FROM prioritized_posts pp
   LEFT JOIN post_tags_agg pta ON pp.id = pta.post_id
   LEFT JOIN comments_agg ca ON pp.id = ca.post_id
   LEFT JOIN views_agg va ON pp.id = va.post_id
   LEFT JOIN collections_agg cola ON pp.id = cola.post_id
   LEFT JOIN slides_agg sa ON pp.id = sa.post_id
   ORDER BY
     pp.priority_score ASC,
     pp.created_at DESC
   LIMIT page_size
   OFFSET offset_param;
 END;
 $function$
;




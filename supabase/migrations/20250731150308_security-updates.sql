set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_or_create_message_settings()
 RETURNS SETOF anonymous_messaging_settings
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  profile_id uuid;
  user_avatar_url text;
  settings_row public.anonymous_messaging_settings; -- Qualify type declaration
  new_slug text;
BEGIN
  -- 1. Get the profile_id from the currently authenticated user
  SELECT id, avatar_url INTO profile_id, user_avatar_url
  FROM public.profiles -- Qualify 'profiles'
  WHERE supabase_user = auth.uid(); -- Qualify 'auth.uid()'

  -- If for some reason the profile doesn't exist, exit.
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- 2. Try to select the existing settings for the user's profile_id.
  SELECT * INTO settings_row
  FROM public.anonymous_messaging_settings -- Qualify 'anonymous_messaging_settings'
  WHERE user_id = profile_id;

  -- 3. If no row was found, create it.
  IF NOT FOUND THEN
    -- Generate a unique slug
    LOOP
      new_slug := lower(substring(replace(gen_random_uuid()::text, '-', ''), 1, 10)); -- Qualify 'gen_random_uuid()'
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.anonymous_messaging_settings WHERE shareable_slug = new_slug); -- Qualify 'anonymous_messaging_settings'
    END LOOP;

    -- Insert the new row with default values
    INSERT INTO public.anonymous_messaging_settings (user_id, shareable_slug, avatar_url) -- Qualify 'anonymous_messaging_settings'
    VALUES (profile_id, new_slug, user_avatar_url)
    RETURNING * INTO settings_row;
  END IF;

  -- 4. Return the settings row.
  RETURN NEXT settings_row;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_stats(profile_id uuid)
 RETURNS TABLE(total_posts bigint, total_comments bigint, total_upvotes bigint, total_views bigint, total_downvotes bigint)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY 
  WITH 
    post_stats AS (
      SELECT 
        COUNT(*) AS post_count,
        COALESCE(SUM(upvotes), 0) AS post_upvotes,
        COALESCE(SUM(downvotes), 0) AS post_downvotes
      FROM public.posts -- Qualify 'posts'
      WHERE created_by = profile_id
    ),
    comment_stats AS (
      SELECT COUNT(*) AS comment_count
      FROM public.comments -- Qualify 'comments'
      WHERE created_by = profile_id
    ),
    view_stats AS (
      SELECT COUNT(*) AS view_count
      FROM public.views -- Qualify 'views'
      WHERE post_id IN (
        SELECT id FROM public.posts WHERE created_by = profile_id -- Qualify 'posts' again
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

CREATE OR REPLACE FUNCTION public.handle_new_profile_preferences()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  -- Explicitly qualify user_preferences with its schema (public)
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user_welcome_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    -- Define variables to hold the JSONB data
    _notification_metadata jsonb;
    _author_name text := 'Xolace Team'; -- Default system author name
    _author_avatar_url text := 'https://qdjrwasidlmgqxakdxkl.supabase.co/storage/v1/object/public/xolace.bucket//xolace-health.png'; -- Default system avatar URL
BEGIN
    -- Construct the JSONB metadata for the welcome notification
    _notification_metadata := jsonb_build_object( -- jsonb_build_object is in pg_catalog
        'icon', '👋', -- Waving hand emoji for welcome
        'tags', jsonb_build_array('welcome', 'onboarding'), -- jsonb_build_array is in pg_catalog
        'title', 'Welcome to Xolace! Camper🔥',
        'author', 'Xolace Team',
        'content', 'We''re thrilled to have you join our community! Explore inspiring content✨, connect with others, and share your moments, experiences and journey. If you need any help, check out our FAQ or contact support.☎️',
        'category', 'welcome',
        'priority', 'low',
        'action_url', '/feed', -- Or '/onboarding-guide' if you have one
        'description', 'Get started with Xolace! 🪄',
        'estimated_read_time', '1 min read'
    );

    -- Insert the welcome notification into the notifications table
    INSERT INTO public.notifications ( -- Qualify 'notifications' table
        recipient_user_id,
        type,
        actor_id, -- Set to null or a system user ID if you have one
        author_name,
        author_avatar_url,
        metadata
    ) VALUES (
        NEW.id, -- NEW.id refers to the ID of the newly created user in profiles
        'system_announcement', -- Use the appropriate enum value
        NULL, -- No specific actor for a system welcome notification
        _author_name,
        _author_avatar_url, -- A generic system avatar URL
        _notification_metadata
    );

    RETURN NEW; -- Important: always return NEW for AFTER triggers
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_prompt_streak()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  today date := current_date;
  yesterday date := current_date - interval '1 day';
  -- Qualify prompt_streaks with its schema
  streak_record public.prompt_streaks;
begin
  -- Qualify prompt_streaks with its schema
  select * into streak_record from public.prompt_streaks where user_id = new.user_id;

  if not found then
    -- First ever prompt response
    -- Qualify prompt_streaks with its schema
    insert into public.prompt_streaks (user_id, current_streak, longest_streak, last_response_date, updated_at)
    values (new.user_id, 1, 1, today, now());

  elsif streak_record.last_response_date = today then
    -- Already responded today; do nothing
    return new;

  elsif streak_record.last_response_date = yesterday then
    -- Continue streak
    -- Qualify prompt_streaks with its schema
    update public.prompt_streaks
    set
      current_streak = streak_record.current_streak + 1,
      longest_streak = greatest(streak_record.longest_streak, streak_record.current_streak + 1),
      last_response_date = today,
      updated_at = now()
    where user_id = new.user_id;

  else
    -- Missed a day: reset streak
    -- Qualify prompt_streaks with its schema
    update public.prompt_streaks
    set
      current_streak = 1,
      longest_streak = greatest(streak_record.longest_streak, 1),
      last_response_date = today,
      updated_at = now()
    where user_id = new.user_id;
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_vote(p_current_vote vote_types, p_post_id uuid, p_user_id uuid, p_vote_type vote_types)
 RETURNS json
 LANGUAGE plpgsql
 SET search_path TO ''
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
      DELETE FROM public.votes -- Qualify 'votes'
      WHERE post_id = p_post_id
      AND user_id = p_user_id
      RETURNING id INTO v_vote_id;
      
      -- Update post vote counts (decrement previous vote)
      IF p_current_vote::vote_types = 'upvote' THEN
        UPDATE public.posts -- Qualify 'posts'
        SET upvotes = upvotes - 1
        WHERE id = p_post_id;
      ELSIF p_current_vote::vote_types = 'downvote' THEN
        UPDATE public.posts -- Qualify 'posts'
        SET downvotes = downvotes - 1
        WHERE id = p_post_id;
      END IF;
    END IF;

    -- If the new vote is different from the current vote
    IF p_current_vote IS NULL OR p_current_vote::vote_types != p_vote_type THEN
      -- Insert new vote and capture the vote data
      INSERT INTO public.votes (post_id, user_id, vote_type) -- Qualify 'votes'
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
        UPDATE public.posts -- Qualify 'posts'
        SET upvotes = upvotes + 1
        WHERE id = p_post_id;
      ELSIF p_vote_type = 'downvote' THEN
        UPDATE public.posts -- Qualify 'posts'
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
    FROM public.posts p -- Qualify 'posts'
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

CREATE OR REPLACE FUNCTION public.increment_reputation(user_id_in uuid, points_in integer)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
 BEGIN
   -- You MUST schema-qualify 'profiles' now
   UPDATE public.profiles
   SET reputation = reputation + points_in
   WHERE id = user_id_in;
 END;
 $function$
;

CREATE OR REPLACE FUNCTION public.mark_all_notifications_as_read()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  -- Explicitly qualify 'notifications' table with its schema
  UPDATE public.notifications
  SET is_read = true
  WHERE is_read = false;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.mark_notification_as_read(notification_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  -- Explicitly qualify 'notifications' table with its schema
  UPDATE public.notifications
  SET is_read = true
  WHERE id = notification_id; -- Security: users can only mark their own
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_created_by_value()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  -- Qualify 'profiles' table with its schema (public)
  -- Qualify 'auth.uid()' with its schema (auth)
  NEW.created_by = ( SELECT id FROM public.profiles WHERE supabase_user = auth.uid());
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_reported_by_value()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  -- Qualify 'profiles' table with its schema (public)
  -- Qualify 'auth.uid()' with its schema (auth)
  NEW.reported_by = ( SELECT id FROM public.profiles WHERE supabase_user = auth.uid());
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_user_id_value_for_row()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  -- Qualify 'profiles' table with its schema (public)
  -- Qualify 'auth.uid()' with its schema (auth)
  NEW.user_id = ( SELECT id FROM public.profiles WHERE supabase_user = auth.uid());
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_video_likes_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Qualify 'videos' with its schema since search_path is now empty
    UPDATE public.videos
    SET likes_count = likes_count + 1
    WHERE id = NEW.video_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Qualify 'videos' with its schema since search_path is now empty
    UPDATE public.videos
    SET likes_count = likes_count - 1
    WHERE id = OLD.video_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.upsert_tags_and_tips_relationship(tag_names text[], tips_id bigint)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  tag_id bigint;
  tag_name text;
BEGIN
  FOREACH tag_name IN ARRAY tag_names LOOP
    -- Upsert tag and get ID (with count increment)
    -- Qualify 'tags' table with its schema
    INSERT INTO public.tags (name, post)
    VALUES (tag_name, 1)
    ON CONFLICT (name) 
    DO UPDATE SET post = public.tags.post + 1
    RETURNING id INTO tag_id;

    -- Create relationship with correct column names
    -- Qualify 'health_tips_tags' table with its schema
    INSERT INTO public.health_tips_tags (tags_id, health_tips)
    VALUES (tag_id, tips_id)
    ON CONFLICT (tags_id, health_tips) DO NOTHING;
  END LOOP;
END;
$function$
;


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION rls_helpers.is_same_user(profile_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  RETURN (
    EXISTS (
      -- Qualify 'profiles' table with its schema (assuming 'public')
      SELECT FROM public.profiles WHERE id=profile_id AND supabase_user = auth.uid()
    )
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION rls_helpers.rls_can_delete_blue_team()
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  return exists (
    select 1
    -- Qualify user_roles and profiles with their schema (assuming 'public')
    from public.user_roles
    join public.profiles on public.profiles.id = public.user_roles.user_id
    -- auth.uid() often works without qualification, but you could add auth.
    where public.profiles.supabase_user = auth.uid()
      and public.user_roles.role = 'blue_team'
  );
end;
$function$
;

CREATE OR REPLACE FUNCTION rls_helpers.rls_can_delete_blue_team(profile_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    -- Qualify user_roles and profiles with their schema (assuming 'public')
    FROM public.user_roles 
    JOIN public.profiles ON public.profiles.id = public.user_roles.user_id
    -- Qualify auth.uid() if auth is not implicitly searched or to be explicit
    WHERE public.profiles.supabase_user = auth.uid()
    AND public.user_roles.role = 'blue_team'
  );
END;
$function$
;




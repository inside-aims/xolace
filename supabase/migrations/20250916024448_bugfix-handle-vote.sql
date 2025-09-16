set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_vote_v1(p_current_vote vote_types, p_post_id uuid, p_user_id uuid, p_vote_type vote_types)
 RETURNS json
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$DECLARE
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
      IF p_current_vote::public.vote_types = 'upvote' THEN
        UPDATE public.posts -- Qualify 'posts'
        SET upvotes = upvotes - 1
        WHERE id = p_post_id;
      ELSIF p_current_vote::public.vote_types = 'downvote' THEN
        UPDATE public.posts -- Qualify 'posts'
        SET downvotes = downvotes - 1
        WHERE id = p_post_id;
      END IF;
    END IF;

    -- If the new vote is different from the current vote
    IF p_current_vote IS NULL OR p_current_vote::public.vote_types != p_vote_type THEN
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
        WHEN p_current_vote::public.vote_types != p_vote_type THEN 'changed'
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
END;$function$
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
      IF p_current_vote::public.vote_types = 'upvote' THEN
        UPDATE public.posts -- Qualify 'posts'
        SET upvotes = upvotes - 1
        WHERE id = p_post_id;
      ELSIF p_current_vote::public.vote_types = 'downvote' THEN
        UPDATE public.posts -- Qualify 'posts'
        SET downvotes = downvotes - 1
        WHERE id = p_post_id;
      END IF;
    END IF;

    -- If the new vote is different from the current vote
    IF p_current_vote IS NULL OR p_current_vote::public.vote_types != p_vote_type THEN
      -- Insert new vote and capture the vote data
      INSERT INTO public.votes (post_id, user_id, vote_type) -- Qualify 'votes'
      VALUES (p_post_id, p_user_id, p_vote_type)
      RETURNING json_build_object(
        'id', id,
        'post_id', post_id,
        'user_id', user_id,
        'vote_type', vote_type,
        'created_at', created_at
      ) INTO v_vote_data;
      
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
        WHEN v_vote_data IS NOT NULL THEN v_vote_data
        ELSE NULL
      END,
      'action', CASE
        WHEN p_current_vote IS NULL THEN 'added'
        WHEN p_current_vote::public.vote_types != p_vote_type THEN 'changed'
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




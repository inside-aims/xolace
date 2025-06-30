alter table "public"."ai_credits" drop constraint "ai_credits_user_id_fkey";

alter table "public"."ai_credits" add constraint "ai_credits_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ai_credits" validate constraint "ai_credits_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_ai_credit_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  is_anon BOOLEAN;
BEGIN
  SELECT is_anonymous INTO is_anon
  FROM public.profiles
  WHERE supabase_user = NEW.supabase_user;

  IF is_anon IS FALSE THEN
    INSERT INTO public.ai_credits (user_id, credits_remaining)
    VALUES (NEW.id, 5);
  END IF;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_health_tip_with_tags(p_title text, p_content text, p_created_by uuid, p_author_name text, p_author_avatar_url text, p_tags text[], p_slug text)
 RETURNS TABLE(id bigint)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$

DECLARE
  v_tip_id bigint;
  v_tag_id bigint;
  tag_name text;
BEGIN
  -- Insert the health tip
  INSERT INTO public.health_tips (
    title,
    content,
    is_sponsored,
    created_by,
    author_name,
    author_avatar_url,
    is_approved,
    slug
  )
  VALUES (
    p_title,
    p_content,
    FALSE,
    p_created_by,
    p_author_name,
    p_author_avatar_url,
    FALSE,
    p_slug
  )
  RETURNING health_tips.id INTO v_tip_id;

  -- Loop through tags and handle each one
  IF array_length(p_tags, 1) > 0 THEN
    FOREACH tag_name IN ARRAY p_tags LOOP

      -- Insert tag or update usage count
      INSERT INTO public.tags (name, post)
      VALUES (tag_name, 1)
      ON CONFLICT (name) DO UPDATE
      SET post = tags.post + 1
      RETURNING tags.id INTO v_tag_id;

      -- Link tag to health tip
      INSERT INTO public.health_tips_tags (tags_id, health_tips)
      VALUES (v_tag_id, v_tip_id)
      ON CONFLICT (tags_id, health_tips) DO NOTHING;

    END LOOP;
  END IF;

  -- Return inserted tip ID
  RETURN QUERY SELECT v_tip_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.reset_credits()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    UPDATE public.ai_credits
    SET credits_remaining = 5
    WHERE credits_remaining < 5; -- Only reset if current credits are less than 5
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_author_name_and_author_avatar()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.author_name = (SELECT username FROM public.profiles WHERE supabase_user = auth.uid());
  NEW.author_avatar_url = (SELECT avatar_url FROM public.profiles WHERE supabase_user = auth.uid());
  RETURN NEW;
END;
$function$
;




alter table "public"."comments" add column "ai_suggestion" boolean not null default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_author_name_and_author_avatar()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  profile_data record;
BEGIN
  -- Check if both author_name and author_avatar_url are already provided.
  -- If so, we don't need to do anything.
  IF NEW.author_name IS NOT NULL AND NEW.author_avatar_url IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Fetch the user's profile data in a single query.
  SELECT username, avatar_url INTO profile_data
  FROM public.profiles WHERE supabase_user = auth.uid();

  -- Only set author_name if it was not provided in the INSERT statement.
  IF NEW.author_name IS NULL THEN
    NEW.author_name = profile_data.username;
  END IF;

  -- Only set author_avatar_url if it was not provided.
  IF NEW.author_avatar_url IS NULL THEN
    NEW.author_avatar_url = profile_data.avatar_url;
  END IF;

  RETURN NEW;
END;
$function$
;




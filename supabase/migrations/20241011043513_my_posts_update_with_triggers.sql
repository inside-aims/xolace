drop trigger if exists "tr_posts_autoset_author_name" on "public"."posts";

drop function if exists "public"."set_post_author_name"();

alter table "public"."posts" add column "author_avatar_url" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_post_author_name_and_author_avatar()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW.author_name = (SELECT username FROM profiles WHERE supabase_user = auth.uid());
  NEW.author_avatar_url = (SELECT avatar_url FROM profiles WHERE supabase_user = auth.uid());
  RETURN NEW;
END;$function$
;

CREATE TRIGGER tr_posts_autoset_author_name BEFORE INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION set_post_author_name_and_author_avatar();



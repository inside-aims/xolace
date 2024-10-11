alter table "public"."posts" add constraint "posts_content_check" CHECK ((length(content) >= 10)) not valid;

alter table "public"."posts" validate constraint "posts_content_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_post_author_name()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW.author_name = (SELECT username FROM profiles WHERE supabase_user = auth.uid());
  RETURN NEW;
END;$function$
;

create policy "Enable users to view their own data only"
on "public"."profiles"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = supabase_user));


CREATE TRIGGER tr_posts_autoset_author_name BEFORE INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION set_post_author_name();



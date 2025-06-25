alter table "public"."feedbacks" drop constraint "feedbacks_created_by_fkey";

alter table "public"."reports" drop constraint "reports_comment_id_fkey";

alter table "public"."reports" drop constraint "reports_post_id_fkey";

alter table "public"."activity_logs" alter column "user_id" drop not null;

alter table "public"."feedbacks" alter column "created_by" drop not null;

alter table "public"."feedbacks" add constraint "feedbacks_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."feedbacks" validate constraint "feedbacks_created_by_fkey";

alter table "public"."reports" add constraint "reports_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."reports" validate constraint "reports_comment_id_fkey";

alter table "public"."reports" add constraint "reports_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."reports" validate constraint "reports_post_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.reset_credits()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE ai_credits
    SET credits_remaining = 5
    WHERE credits_remaining < 5; -- Only reset if current credits are less than 5
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_author_name_and_author_avatar()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW.author_name = (SELECT username FROM profiles WHERE supabase_user = auth.uid());
  NEW.author_avatar_url = (SELECT avatar_url FROM profiles WHERE supabase_user = auth.uid());
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.set_reported_by_value()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW.reported_by = ( SELECT id FROM profiles WHERE supabase_user = auth.uid());
  RETURN NEW;
END;$function$
;

create policy "Enable insert for authenticated users only"
on "public"."feedbacks"
as permissive
for insert
to authenticated
with check (true);



set check_function_bodies = off;

CREATE OR REPLACE FUNCTION rls_helpers.is_same_user(profile_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN (
    EXISTS (
      SELECT FROM profiles WHERE id=profile_id AND supabase_user = auth.uid()
    )
  );
END;$function$
;



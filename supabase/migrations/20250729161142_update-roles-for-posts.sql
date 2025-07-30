-- 1. Drop the RLS policy that depends on the 'role' column
drop policy if exists "Consolidated delete policy for authenticated users" on "public"."user_roles";

drop policy if exists "Enable insert for authenticated users only" on "public"."health_tips";

drop policy if exists "Users can view their own roles, mods see all" on "public"."user_roles";

alter table "public"."user_roles" disable row level security;

drop view if exists "public"."professionals_public_view";

alter table "public"."profiles" alter column "role" drop default;

alter table "public"."user_roles" alter column "role" drop default;

alter type "public"."user_role" rename to "user_role__old_version_to_be_dropped";

create type "public"."user_role" as enum ('normal_user', 'verified', 'blue_team', 'help_professional', 'mentor');

alter table "public"."profiles" alter column role type "public"."user_role" using role::text::"public"."user_role";

alter table "public"."user_roles" alter column role type "public"."user_role" using role::text::"public"."user_role";

alter table "public"."profiles" alter column "role" set default 'normal_user'::user_role;

alter table "public"."user_roles" alter column "role" set default 'normal_user'::user_role;

drop type "public"."user_role__old_version_to_be_dropped";

-- 3. Recreate the dropped policy
create policy "Consolidated delete policy for authenticated users"
on "public"."user_roles"
for delete
to authenticated
using (((user_id = ( SELECT p.id
   FROM profiles p
  WHERE (p.supabase_user = ( SELECT auth.uid() AS uid)))) OR (( SELECT p.role
   FROM profiles p
  WHERE (p.supabase_user = ( SELECT auth.uid() AS uid))) = 'blue_team'::user_role)));

create policy "Enable insert for authenticated users only" 
on "public"."health_tips"
to authenticated
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'help_professional'::user_role)))));

  create policy "Users can view their own roles, mods see all" 
on "public"."user_roles"
to public
using (((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.supabase_user = ( SELECT auth.uid() AS uid)))) OR (( SELECT profiles.role
   FROM profiles
  WHERE (profiles.supabase_user = ( SELECT auth.uid() AS uid))) = 'blue_team'::user_role)));

alter table "public"."posts" add column "author_roles" user_role[] not null default '{}'::user_role[];


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_post_author_roles()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    -- Declare a variable for the author's roles (an array of user_role enum)
    author_active_roles public.user_role[];
BEGIN
    -- Check if created_by is not NULL (i.e., it's an actual user post)
    IF NEW.created_by IS NOT NULL THEN
        -- Collect all distinct roles for this user from the user_roles table
        -- The ARRAY(SELECT ...) subquery collects all roles into an array
        SELECT ARRAY(SELECT role FROM public.user_roles WHERE user_id = NEW.created_by)
        INTO author_active_roles;

        -- Assign the collected roles to the new post's author_roles column
        NEW.author_roles = COALESCE(author_active_roles, '{}'::public.user_role[]);
    ELSE
        -- If created_by is NULL (e.g., a system post), set roles to an empty array
        NEW.author_roles = '{}'::public.user_role[];
    END IF;

    RETURN NEW;
END;
$function$
;

create or replace view "public"."professionals_public_view" as  SELECT hp.id,
    hp.field,
    hp.bio,
    hp.years_of_experience,
    p.username,
    p.avatar_url
   FROM (health_professionals hp
     JOIN profiles p ON ((hp.id = p.id)))
  WHERE (hp.verified_by_admin = true);


CREATE TRIGGER tr_posts_set_author_roles BEFORE INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION set_post_author_roles();




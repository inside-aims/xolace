drop policy "Only mods can delete roles" on "public"."user_roles";

drop policy "Users can view their own roles, mods see all" on "public"."user_roles";

alter table "public"."profiles" alter column "role" drop default;

alter table "public"."user_roles" alter column "role" drop default;

alter type "public"."user_role" rename to "user_role__old_version_to_be_dropped";

create type "public"."user_role" as enum ('normal_user', 'verified', 'blue_team', 'help_professional');

alter table "public"."profiles" alter column role type "public"."user_role" using role::text::"public"."user_role";

alter table "public"."user_roles" alter column role type "public"."user_role" using role::text::"public"."user_role";

alter table "public"."profiles" alter column "role" set default 'normal_user'::user_role;

alter table "public"."user_roles" alter column "role" set default 'normal_user'::user_role;

drop type "public"."user_role__old_version_to_be_dropped";

CREATE OR REPLACE FUNCTION rls_helpers.rls_can_delete_blue_team(profile_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles 
    JOIN profiles ON profiles.id = user_roles.user_id
    WHERE profiles.supabase_user = auth.uid()
    AND user_roles.role = 'blue_team'
    -- Removed: AND profiles.id = profile_id
  );
END;$function$
;

create policy "Allow delete for blue team"
on "public"."comments"
as permissive
for delete
to authenticated
using (rls_helpers.rls_can_delete_blue_team(created_by));


create policy "Allow delete for blue team"
on "public"."posts"
as permissive
for delete
to authenticated
using (rls_helpers.rls_can_delete_blue_team(created_by));


create policy "Only mods can delete roles"
on "public"."user_roles"
as permissive
for delete
to public
using ((( SELECT profiles.role
   FROM profiles
  WHERE (profiles.supabase_user = auth.uid())) = 'blue_team'::user_role));


create policy "Users can view their own roles, mods see all"
on "public"."user_roles"
as permissive
for select
to public
using (((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.supabase_user = auth.uid()))) OR (( SELECT profiles.role
   FROM profiles
  WHERE (profiles.supabase_user = auth.uid())) = 'blue_team'::user_role)));



set check_function_bodies = off;






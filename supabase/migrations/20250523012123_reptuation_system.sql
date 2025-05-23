alter table "public"."profiles" add column "reputation" bigint not null default '0'::bigint;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.increment_reputation(user_id_in uuid, points_in integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
 BEGIN
   UPDATE profiles
   SET reputation = reputation + points_in
   WHERE id = user_id_in;
 END;
 $function$
;

create policy "Enable update for all users"
on "public"."profiles"
as permissive
for update
to authenticated
using (true);





drop policy "Enable read access for all users" on "public"."profiles";

alter table "public"."posts" alter column "mood" drop default;

alter type "public"."post_mood" rename to "post_mood__old_version_to_be_dropped";

create type "public"."post_mood" as enum ('neutral', 'confused', 'sad', 'happy', 'angry');

alter table "public"."posts" alter column mood type "public"."post_mood" using mood::text::"public"."post_mood";

alter table "public"."posts" alter column "mood" set default 'neutral'::post_mood;

drop type "public"."post_mood__old_version_to_be_dropped";

create policy "Enable read access for all authenticated users"
on "public"."profiles"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for only user's own profile"
on "public"."profiles"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = supabase_user))
with check ((( SELECT auth.uid() AS uid) = supabase_user));




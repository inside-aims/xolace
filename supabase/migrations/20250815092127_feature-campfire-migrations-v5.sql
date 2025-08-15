alter table "public"."campfire_members" add column "is_favorite" boolean not null default false;

CREATE INDEX idx_campfire_members_user_campfire_favorite ON public.campfire_members USING btree (user_id, campfire_id, is_favorite);

CREATE INDEX idx_campfire_members_user_favorite ON public.campfire_members USING btree (user_id, is_favorite) WHERE (is_favorite = true);

create policy "Allow user to update own row"
on "public"."campfire_members"
as permissive
for update
to authenticated
using ((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.supabase_user = auth.uid()))));





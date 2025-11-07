create type "public"."loading_experience_types" as enum ('adaptive', 'minimal', 'none');

alter table "public"."help_center" drop constraint "help center_created_by_fkey";

alter table "public"."help_center" drop constraint "help center_pkey";

drop index if exists "public"."help center_pkey";

drop index if exists "public"."idx_campfire_members_campfire_id";

alter table "public"."campfire_guide_resources" enable row level security;

alter table "public"."user_preferences" add column "loading_experience" loading_experience_types not null default 'none'::loading_experience_types;

alter table "public"."video_collections" alter column "video_id" drop default;

CREATE UNIQUE INDEX help_center_pkey ON public.help_center USING btree (id);

CREATE INDEX idx_comments_post_parent ON public.comments USING btree (post, parent_id);

CREATE INDEX idx_posts_daily_prompt ON public.posts USING btree (daily_prompt_id) WHERE (daily_prompt_id IS NOT NULL);

CREATE UNIQUE INDEX ux_post_slides_post_idx ON public.post_slides USING btree (post_id, slide_index);

alter table "public"."help_center" add constraint "help_center_pkey" PRIMARY KEY using index "help_center_pkey";

alter table "public"."help_center" add constraint "help_center_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."help_center" validate constraint "help_center_created_by_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.mark_all_notifications_as_read()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE v_profile_id uuid;
BEGIN
  SELECT id INTO v_profile_id FROM public.profiles WHERE supabase_user = auth.uid();
  IF v_profile_id IS NULL THEN RETURN; END IF;

  UPDATE public.notifications
  SET is_read = true
  WHERE is_read = false
    AND recipient_user_id = v_profile_id;
END$function$
;

CREATE OR REPLACE FUNCTION public.mark_notification_as_read(notification_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE v_profile_id uuid;
BEGIN
  SELECT id INTO v_profile_id FROM public.profiles WHERE supabase_user = auth.uid();
  IF v_profile_id IS NULL THEN RETURN; END IF;

  UPDATE public.notifications
  SET is_read = true
  WHERE id = notification_id
    AND recipient_user_id = v_profile_id;
END$function$
;

create policy "Enable delete for authenticated users only"
on "public"."campfire_guide_resources"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."campfire_guide_resources"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for auth users"
on "public"."campfire_guide_resources"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."campfire_guide_resources"
as permissive
for update
to authenticated
using (true)
with check (true);





drop policy "Enable delete for users based on user_id" on "public"."user_roles";

drop policy "Only mods can delete roles" on "public"."user_roles";

drop policy "Enable delete for users based on user_id" on "public"."collections";

drop policy "Professional can update own health profile" on "public"."health_professionals";

drop policy "Enable insert for authenticated users only" on "public"."health_tips";

drop policy "Enable users to view their own data only" on "public"."help_center";

drop policy "Users can view their own roles, mods see all" on "public"."user_roles";

drop policy "Enable delete for users based on user_id" on "public"."video_collections";

drop index if exists "public"."idx_user_roles_user_id_role";

create table "public"."anonymous_messages" (
    "id" uuid not null default gen_random_uuid(),
    "recipient_id" uuid not null,
    "content" text not null,
    "is_read" boolean not null default false,
    "shared_at" timestamp with time zone,
    "sender_ip_hash" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."anonymous_messages" enable row level security;

create table "public"."anonymous_messaging_settings" (
    "user_id" uuid not null,
    "shareable_slug" text not null,
    "page_title" text not null default 'Send me an anonymous message!'::text,
    "welcome_message" text,
    "custom_prompt" text not null default 'What''s on your mind? Share it anonymously.'::text,
    "background_theme" text not null default 'sunset-vibes'::text,
    "selected_icon" text not null default 'Heart'::text,
    "show_character_count" boolean not null default true,
    "min_length" integer not null default 10,
    "updated_at" timestamp with time zone default now(),
    "created_at" timestamp with time zone not null default now(),
    "avatar_url" text,
    "username" text not null default 'Anonymous'::text,
    "has_min_length" boolean not null default true
);


alter table "public"."anonymous_messaging_settings" enable row level security;


CREATE UNIQUE INDEX anonymous_messages_pkey ON public.anonymous_messages USING btree (id);

CREATE UNIQUE INDEX anonymous_messaging_settings_pkey ON public.anonymous_messaging_settings USING btree (user_id);

CREATE UNIQUE INDEX anonymous_messaging_settings_shareable_slug_key ON public.anonymous_messaging_settings USING btree (shareable_slug);

CREATE INDEX idx_ams_shareable_slug ON public.anonymous_messaging_settings USING btree (shareable_slug);

CREATE INDEX idx_anonymous_messages_recipient_id ON public.anonymous_messages USING btree (recipient_id);

CREATE INDEX idx_comments_parent_id ON public.comments USING btree (parent_id);

alter table "public"."anonymous_messages" add constraint "anonymous_messages_pkey" PRIMARY KEY using index "anonymous_messages_pkey";

alter table "public"."anonymous_messaging_settings" add constraint "anonymous_messaging_settings_pkey" PRIMARY KEY using index "anonymous_messaging_settings_pkey";

alter table "public"."anonymous_messages" add constraint "anonymous_messages_recipient_id_fkey" FOREIGN KEY (recipient_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."anonymous_messages" validate constraint "anonymous_messages_recipient_id_fkey";

alter table "public"."anonymous_messaging_settings" add constraint "ams_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."anonymous_messaging_settings" validate constraint "ams_user_id_fkey";

alter table "public"."anonymous_messaging_settings" add constraint "anonymous_messaging_settings_shareable_slug_key" UNIQUE using index "anonymous_messaging_settings_shareable_slug_key";

alter table "public"."anonymous_messaging_settings" add constraint "slug_format_check" CHECK ((shareable_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'::text)) not valid;

alter table "public"."anonymous_messaging_settings" validate constraint "slug_format_check";

alter table "public"."anonymous_messaging_settings" add constraint "slug_length_check" CHECK ((char_length(shareable_slug) > 3)) not valid;

alter table "public"."anonymous_messaging_settings" validate constraint "slug_length_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_or_create_message_settings()
 RETURNS SETOF anonymous_messaging_settings
 LANGUAGE plpgsql
AS $function$DECLARE
  profile_id uuid;
  user_avatar_url text;
  settings_row anonymous_messaging_settings;
  new_slug text;
BEGIN
  -- 1. Get the profile_id from the currently authenticated user
  SELECT id, avatar_url INTO profile_id, user_avatar_url
  FROM public.profiles
  WHERE supabase_user = auth.uid();
  
  -- If for some reason the profile doesn't exist, exit.
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- 2. Try to select the existing settings for the user's profile_id.
  SELECT * INTO settings_row
  FROM public.anonymous_messaging_settings
  WHERE user_id = profile_id;

  -- 3. If no row was found, create it.
  IF NOT FOUND THEN
    -- Generate a unique slug
    LOOP
      new_slug := lower(substring(replace(gen_random_uuid()::text, '-', ''), 1, 10));
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.anonymous_messaging_settings WHERE shareable_slug = new_slug);
    END LOOP;

    -- Insert the new row with default values
    INSERT INTO public.anonymous_messaging_settings (user_id, shareable_slug, avatar_url)
    VALUES (profile_id, new_slug, user_avatar_url)
    RETURNING * INTO settings_row;
  END IF;

  -- 4. Return the settings row.
  RETURN NEXT settings_row;
END;$function$
;

grant delete on table "public"."anonymous_messages" to "anon";

grant insert on table "public"."anonymous_messages" to "anon";

grant references on table "public"."anonymous_messages" to "anon";

grant select on table "public"."anonymous_messages" to "anon";

grant trigger on table "public"."anonymous_messages" to "anon";

grant truncate on table "public"."anonymous_messages" to "anon";

grant update on table "public"."anonymous_messages" to "anon";

grant delete on table "public"."anonymous_messages" to "authenticated";

grant insert on table "public"."anonymous_messages" to "authenticated";

grant references on table "public"."anonymous_messages" to "authenticated";

grant select on table "public"."anonymous_messages" to "authenticated";

grant trigger on table "public"."anonymous_messages" to "authenticated";

grant truncate on table "public"."anonymous_messages" to "authenticated";

grant update on table "public"."anonymous_messages" to "authenticated";

grant delete on table "public"."anonymous_messages" to "service_role";

grant insert on table "public"."anonymous_messages" to "service_role";

grant references on table "public"."anonymous_messages" to "service_role";

grant select on table "public"."anonymous_messages" to "service_role";

grant trigger on table "public"."anonymous_messages" to "service_role";

grant truncate on table "public"."anonymous_messages" to "service_role";

grant update on table "public"."anonymous_messages" to "service_role";

grant delete on table "public"."anonymous_messaging_settings" to "anon";

grant insert on table "public"."anonymous_messaging_settings" to "anon";

grant references on table "public"."anonymous_messaging_settings" to "anon";

grant select on table "public"."anonymous_messaging_settings" to "anon";

grant trigger on table "public"."anonymous_messaging_settings" to "anon";

grant truncate on table "public"."anonymous_messaging_settings" to "anon";

grant update on table "public"."anonymous_messaging_settings" to "anon";

grant delete on table "public"."anonymous_messaging_settings" to "authenticated";

grant insert on table "public"."anonymous_messaging_settings" to "authenticated";

grant references on table "public"."anonymous_messaging_settings" to "authenticated";

grant select on table "public"."anonymous_messaging_settings" to "authenticated";

grant trigger on table "public"."anonymous_messaging_settings" to "authenticated";

grant truncate on table "public"."anonymous_messaging_settings" to "authenticated";

grant update on table "public"."anonymous_messaging_settings" to "authenticated";

grant delete on table "public"."anonymous_messaging_settings" to "service_role";

grant insert on table "public"."anonymous_messaging_settings" to "service_role";

grant references on table "public"."anonymous_messaging_settings" to "service_role";

grant select on table "public"."anonymous_messaging_settings" to "service_role";

grant trigger on table "public"."anonymous_messaging_settings" to "service_role";

grant truncate on table "public"."anonymous_messaging_settings" to "service_role";

grant update on table "public"."anonymous_messaging_settings" to "service_role";

create policy "Enable update for recipient users"
on "public"."anonymous_messages"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.id = anonymous_messages.recipient_id)))));


create policy "Insert for everyone"
on "public"."anonymous_messages"
as permissive
for insert
to public
with check (true);


create policy "Only recipient can see their messages"
on "public"."anonymous_messages"
as permissive
for select
to authenticated
using ((recipient_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.supabase_user = ( SELECT auth.uid() AS uid)))));


create policy "Allow all to see user settings "
on "public"."anonymous_messaging_settings"
as permissive
for select
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."anonymous_messaging_settings"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable update for only own data"
on "public"."anonymous_messaging_settings"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.id = anonymous_messaging_settings.user_id)))));


create policy "Consolidated delete policy for authenticated users"
on "public"."user_roles"
as permissive
for delete
to authenticated
using (((user_id = ( SELECT p.id
   FROM profiles p
  WHERE (p.supabase_user = ( SELECT auth.uid() AS uid)))) OR (( SELECT p.role
   FROM profiles p
  WHERE (p.supabase_user = ( SELECT auth.uid() AS uid))) = 'blue_team'::user_role)));


create policy "Enable delete for users based on user_id"
on "public"."collections"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.id = collections.user_id)))));


create policy "Professional can update own health profile"
on "public"."health_professionals"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = ( SELECT profiles.supabase_user
   FROM profiles
  WHERE (profiles.id = health_professionals.id))));


create policy "Enable insert for authenticated users only"
on "public"."health_tips"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'help_professional'::user_role)))));


create policy "Enable users to view their own data only"
on "public"."help_center"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.id = help_center.created_by)))));


create policy "Users can view their own roles, mods see all"
on "public"."user_roles"
as permissive
for select
to public
using (((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.supabase_user = ( SELECT auth.uid() AS uid)))) OR (( SELECT profiles.role
   FROM profiles
  WHERE (profiles.supabase_user = ( SELECT auth.uid() AS uid))) = 'blue_team'::user_role)));


create policy "Enable delete for users based on user_id"
on "public"."video_collections"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.id = video_collections.user_id)))));





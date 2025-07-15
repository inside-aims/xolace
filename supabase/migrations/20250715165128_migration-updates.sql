create type "public"."notification_target_type" as enum ('single_user', 'role_based', 'all_users', 'new_users');

create type "public"."notification_type" as enum ('new_upvote', 'new_downvote', 'new_comment', 'post_saved', 'video_saved', 'video_liked', 'system_announcement', 'post_viewed');

create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "recipient_user_id" uuid not null,
    "actor_id" uuid,
    "author_name" text,
    "author_avatar_url" text,
    "type" notification_type not null,
    "target_type" notification_target_type default 'single_user'::notification_target_type,
    "entity_id" text,
    "metadata" jsonb default '{}'::jsonb,
    "is_read" boolean not null default false
);


alter table "public"."notifications" enable row level security;

CREATE INDEX idx_notifications_recipient_unread ON public.notifications USING btree (recipient_user_id, is_read) WHERE (is_read = false);

CREATE INDEX idx_notifications_recipient_user ON public.notifications USING btree (recipient_user_id, created_at DESC);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."notifications" add constraint "notifications_actor_id_fkey" FOREIGN KEY (actor_id) REFERENCES profiles(id) ON DELETE SET NULL not valid;

alter table "public"."notifications" validate constraint "notifications_actor_id_fkey";

alter table "public"."notifications" add constraint "notifications_recipient_user_id_fkey" FOREIGN KEY (recipient_user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_recipient_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.mark_all_notifications_as_read()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE public.notifications
  SET is_read = true
  WHERE is_read = false;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.mark_notification_as_read(notification_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE public.notifications
  SET is_read = true
  WHERE id = notification_id; -- Security: users can only mark their own
END;
$function$
;

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."notifications"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable recipient to view recipient only"
on "public"."notifications"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.id = notifications.recipient_user_id)))));


create policy "Enable update for recipient users"
on "public"."notifications"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.id = notifications.recipient_user_id)))));


CREATE TRIGGER tr_notifications_autoset_author_name_avatar BEFORE INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION set_author_name_and_author_avatar();




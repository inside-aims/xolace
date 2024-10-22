create type "public"."post_mood" as enum ('neutral', 'confused', 'sad', 'happy', 'funny');

create table "public"."posts" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid not null,
    "author_name" text not null,
    "content" text not null,
    "mood" post_mood not null default 'neutral'::post_mood
);


alter table "public"."posts" enable row level security;

alter table "public"."profiles" alter column "username" set not null;

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."posts" add constraint "posts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."posts" validate constraint "posts_created_by_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_created_by_value()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW.created_by = ( SELECT id FROM profiles WHERE supabase_user = auth.uid());
  RETURN NEW;
END;$function$
;

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."posts"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users"
on "public"."posts"
as permissive
for select
to authenticated
using (true);


CREATE TRIGGER tr_posts_autoset_created_by BEFORE INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION set_created_by_value();



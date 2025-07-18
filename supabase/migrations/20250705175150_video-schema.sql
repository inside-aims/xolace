create type "public"."visibility_options" as enum ('public', 'private');

create table "public"."videos" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "title" text not null,
    "description" text not null,
    "video_url" text not null,
    "video_id" text not null,
    "thumbnail_url" text not null,
    "visibility" visibility_options not null default 'public'::visibility_options,
    "user_id" uuid,
    "views" bigint not null default '0'::bigint,
    "duration" bigint,
    "updated_at" timestamp with time zone not null default now(),
    "author_name" text not null,
    "author_avatar_url" text not null
);


alter table "public"."videos" enable row level security;

CREATE UNIQUE INDEX videos_pkey ON public.videos USING btree (id);

alter table "public"."videos" add constraint "videos_pkey" PRIMARY KEY using index "videos_pkey";

alter table "public"."videos" add constraint "videos_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."videos" validate constraint "videos_user_id_fkey";

grant delete on table "public"."videos" to "anon";

grant insert on table "public"."videos" to "anon";

grant references on table "public"."videos" to "anon";

grant select on table "public"."videos" to "anon";

grant trigger on table "public"."videos" to "anon";

grant truncate on table "public"."videos" to "anon";

grant update on table "public"."videos" to "anon";

grant delete on table "public"."videos" to "authenticated";

grant insert on table "public"."videos" to "authenticated";

grant references on table "public"."videos" to "authenticated";

grant select on table "public"."videos" to "authenticated";

grant trigger on table "public"."videos" to "authenticated";

grant truncate on table "public"."videos" to "authenticated";

grant update on table "public"."videos" to "authenticated";

grant delete on table "public"."videos" to "service_role";

grant insert on table "public"."videos" to "service_role";

grant references on table "public"."videos" to "service_role";

grant select on table "public"."videos" to "service_role";

grant trigger on table "public"."videos" to "service_role";

grant truncate on table "public"."videos" to "service_role";

grant update on table "public"."videos" to "service_role";

create policy "Enable insert for auth users "
on "public"."videos"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable view for auth users "
on "public"."videos"
as permissive
for select
to authenticated
using (true);


CREATE TRIGGER tr_videos_autoset_author_name_avatar BEFORE INSERT ON public.videos FOR EACH ROW EXECUTE FUNCTION set_author_name_and_author_avatar();

CREATE TRIGGER tr_videos_autoset_user_id BEFORE INSERT ON public.videos FOR EACH ROW EXECUTE FUNCTION set_user_id_value_for_row();




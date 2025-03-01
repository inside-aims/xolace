create table "public"."views" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid,
    "post_id" uuid
);


alter table "public"."views" enable row level security;

alter table "public"."posts" drop column "views";

CREATE UNIQUE INDEX unique_user_post ON public.views USING btree (user_id, post_id);

CREATE UNIQUE INDEX views_pkey ON public.views USING btree (id);

alter table "public"."views" add constraint "views_pkey" PRIMARY KEY using index "views_pkey";

alter table "public"."views" add constraint "unique_user_post" UNIQUE using index "unique_user_post";

alter table "public"."views" add constraint "views_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."views" validate constraint "views_post_id_fkey";

alter table "public"."views" add constraint "views_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."views" validate constraint "views_user_id_fkey";

grant delete on table "public"."views" to "anon";

grant insert on table "public"."views" to "anon";

grant references on table "public"."views" to "anon";

grant select on table "public"."views" to "anon";

grant trigger on table "public"."views" to "anon";

grant truncate on table "public"."views" to "anon";

grant update on table "public"."views" to "anon";

grant delete on table "public"."views" to "authenticated";

grant insert on table "public"."views" to "authenticated";

grant references on table "public"."views" to "authenticated";

grant select on table "public"."views" to "authenticated";

grant trigger on table "public"."views" to "authenticated";

grant truncate on table "public"."views" to "authenticated";

grant update on table "public"."views" to "authenticated";

grant delete on table "public"."views" to "service_role";

grant insert on table "public"."views" to "service_role";

grant references on table "public"."views" to "service_role";

grant select on table "public"."views" to "service_role";

grant trigger on table "public"."views" to "service_role";

grant truncate on table "public"."views" to "service_role";

grant update on table "public"."views" to "service_role";

create policy "Allow insert to auth users"
on "public"."views"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow read access to all authenticated users"
on "public"."views"
as permissive
for select
to authenticated
using (true);





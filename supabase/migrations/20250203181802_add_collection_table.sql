create table "public"."collections" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "post_id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "collection_name" text default 'favorites'::text
);


alter table "public"."collections" enable row level security;

CREATE UNIQUE INDEX collections_pkey ON public.collections USING btree (id);

CREATE INDEX idx_collections_post_id ON public.collections USING btree (post_id);

CREATE INDEX idx_collections_user_id ON public.collections USING btree (user_id);

CREATE UNIQUE INDEX unique_collection_entry ON public.collections USING btree (user_id, post_id, collection_name);

CREATE UNIQUE INDEX unique_user_post_vote ON public.votes USING btree (user_id, post_id);

alter table "public"."collections" add constraint "collections_pkey" PRIMARY KEY using index "collections_pkey";

alter table "public"."collections" add constraint "collections_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE not valid;

alter table "public"."collections" validate constraint "collections_post_id_fkey";

alter table "public"."collections" add constraint "collections_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."collections" validate constraint "collections_user_id_fkey1";

alter table "public"."votes" add constraint "unique_user_post_vote" UNIQUE using index "unique_user_post_vote";

grant delete on table "public"."collections" to "anon";

grant insert on table "public"."collections" to "anon";

grant references on table "public"."collections" to "anon";

grant select on table "public"."collections" to "anon";

grant trigger on table "public"."collections" to "anon";

grant truncate on table "public"."collections" to "anon";

grant update on table "public"."collections" to "anon";

grant delete on table "public"."collections" to "authenticated";

grant insert on table "public"."collections" to "authenticated";

grant references on table "public"."collections" to "authenticated";

grant select on table "public"."collections" to "authenticated";

grant trigger on table "public"."collections" to "authenticated";

grant truncate on table "public"."collections" to "authenticated";

grant update on table "public"."collections" to "authenticated";

grant delete on table "public"."collections" to "service_role";

grant insert on table "public"."collections" to "service_role";

grant references on table "public"."collections" to "service_role";

grant select on table "public"."collections" to "service_role";

grant trigger on table "public"."collections" to "service_role";

grant truncate on table "public"."collections" to "service_role";

grant update on table "public"."collections" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."collections"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = auth.uid()) AND (profiles.id = collections.user_id)))));


create policy "Enable insert for authenticated users only"
on "public"."collections"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable update for users based on user_id"
on "public"."collections"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."collections"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = auth.uid()) AND (profiles.id = collections.user_id)))));


create policy "Enable delete for users based on user_id"
on "public"."votes"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = auth.uid()) AND (profiles.id = votes.user_id)))));





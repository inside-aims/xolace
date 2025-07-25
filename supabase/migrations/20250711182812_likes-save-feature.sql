alter type "public"."action_type" rename to "action_type__old_version_to_be_dropped";

create type "public"."action_type" as enum ('created', 'deleted', 'updated', 'commented', 'reported', 'upvoted', 'downvoted', 'viewed', 'added', 'liked');

alter type "public"."entity_types" rename to "entity_types__old_version_to_be_dropped";

create type "public"."entity_types" as enum ('post', 'comment', 'vote', 'report', 'profile', 'system', 'view', 'video');

create table "public"."video_collections" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "video_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "collection_name" text default 'favorites'::text
);


alter table "public"."video_collections" enable row level security;

create table "public"."video_likes" (
    "id" bigint generated by default as identity not null,
    "user_id" uuid,
    "video_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."video_likes" enable row level security;

alter table "public"."activity_logs" alter column action type "public"."action_type" using action::text::"public"."action_type";

alter table "public"."activity_logs" alter column entity_type type "public"."entity_types" using entity_type::text::"public"."entity_types";

drop type "public"."action_type__old_version_to_be_dropped";

drop type "public"."entity_types__old_version_to_be_dropped";

alter table "public"."activity_logs" add column "video_id" uuid;

alter table "public"."videos" add column "likes_count" bigint not null default 0;

CREATE INDEX idx_video_likes_user ON public.video_likes USING btree (user_id);

CREATE INDEX idx_video_likes_video ON public.video_likes USING btree (video_id);

CREATE UNIQUE INDEX unique_user_video_like ON public.video_likes USING btree (user_id, video_id);

CREATE UNIQUE INDEX unique_video_collection_entry ON public.video_collections USING btree (user_id, video_id, collection_name);

CREATE UNIQUE INDEX video_collections_pkey ON public.video_collections USING btree (id);

CREATE UNIQUE INDEX video_likes_pkey ON public.video_likes USING btree (id);

CREATE UNIQUE INDEX videos_video_id_key ON public.videos USING btree (video_id);

alter table "public"."video_collections" add constraint "video_collections_pkey" PRIMARY KEY using index "video_collections_pkey";

alter table "public"."video_likes" add constraint "video_likes_pkey" PRIMARY KEY using index "video_likes_pkey";

alter table "public"."activity_logs" add constraint "activity_logs_video_id_fkey" FOREIGN KEY (video_id) REFERENCES videos(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."activity_logs" validate constraint "activity_logs_video_id_fkey";

alter table "public"."video_collections" add constraint "video_collections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."video_collections" validate constraint "video_collections_user_id_fkey";

alter table "public"."video_collections" add constraint "video_collections_video_id_fkey" FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE not valid;

alter table "public"."video_collections" validate constraint "video_collections_video_id_fkey";

alter table "public"."video_likes" add constraint "unique_user_video_like" UNIQUE using index "unique_user_video_like";

alter table "public"."video_likes" add constraint "video_likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL not valid;

alter table "public"."video_likes" validate constraint "video_likes_user_id_fkey";

alter table "public"."video_likes" add constraint "video_likes_video_id_fkey" FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE not valid;

alter table "public"."video_likes" validate constraint "video_likes_video_id_fkey";

alter table "public"."videos" add constraint "videos_video_id_key" UNIQUE using index "videos_video_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_video_likes_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.videos
    SET likes_count = likes_count + 1
    WHERE id = NEW.video_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.videos
    SET likes_count = likes_count - 1
    WHERE id = OLD.video_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_post_with_tags(content text, mood post_mood, expires_in_24hr boolean, duration post_duration DEFAULT NULL::post_duration, expires_at timestamp with time zone DEFAULT NULL::timestamp with time zone, is_sensitive boolean DEFAULT false, is_prompt_response boolean DEFAULT false, type post_type DEFAULT 'single'::post_type, tag_names text[] DEFAULT NULL::text[], slide_contents text[] DEFAULT NULL::text[])
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
    post_id UUID;
    tag_id BIGINT;
    tag_name TEXT;
    slide_content TEXT;
    i INTEGER := 1;
BEGIN
    -- Insert the post
    INSERT INTO public.posts (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive,
        is_prompt_response,
        type
    )
    VALUES (
        content,
        mood,
        expires_in_24hr,
        duration,        -- This will now be NULL if not provided
        expires_at,      -- This will now be NULL if not provided
        is_sensitive,
        is_prompt_response,
        type
    )
    RETURNING id INTO post_id;

    -- Process and attach tags if provided
    IF tag_names IS NOT NULL AND array_length(tag_names, 1) > 0 THEN
        FOREACH tag_name IN ARRAY tag_names LOOP
            -- Get or create tag
            INSERT INTO public.tags (name, post)
            VALUES (tag_name, 1)
            ON CONFLICT (name) DO UPDATE
            SET post = tags.post + 1
            RETURNING id INTO tag_id;

            -- Link tag to post
            INSERT INTO public.posttags (tag, post)
            VALUES (tag_id, post_id)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;

    -- If it's a carousel post, save slides
    IF type = 'carousel' AND slide_contents IS NOT NULL AND array_length(slide_contents, 1) > 0 THEN
        FOREACH slide_content IN ARRAY slide_contents LOOP
            INSERT INTO public.post_slides (post_id, slide_index, content)
            VALUES (post_id, i - 1, slide_content);
            i := i + 1;
        END LOOP;
    END IF;

    RETURN post_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to create post: %', SQLERRM;
END;
$function$
;

grant delete on table "public"."video_collections" to "anon";

grant insert on table "public"."video_collections" to "anon";

grant references on table "public"."video_collections" to "anon";

grant select on table "public"."video_collections" to "anon";

grant trigger on table "public"."video_collections" to "anon";

grant truncate on table "public"."video_collections" to "anon";

grant update on table "public"."video_collections" to "anon";

grant delete on table "public"."video_collections" to "authenticated";

grant insert on table "public"."video_collections" to "authenticated";

grant references on table "public"."video_collections" to "authenticated";

grant select on table "public"."video_collections" to "authenticated";

grant trigger on table "public"."video_collections" to "authenticated";

grant truncate on table "public"."video_collections" to "authenticated";

grant update on table "public"."video_collections" to "authenticated";

grant delete on table "public"."video_collections" to "service_role";

grant insert on table "public"."video_collections" to "service_role";

grant references on table "public"."video_collections" to "service_role";

grant select on table "public"."video_collections" to "service_role";

grant trigger on table "public"."video_collections" to "service_role";

grant truncate on table "public"."video_collections" to "service_role";

grant update on table "public"."video_collections" to "service_role";

grant delete on table "public"."video_likes" to "anon";

grant insert on table "public"."video_likes" to "anon";

grant references on table "public"."video_likes" to "anon";

grant select on table "public"."video_likes" to "anon";

grant trigger on table "public"."video_likes" to "anon";

grant truncate on table "public"."video_likes" to "anon";

grant update on table "public"."video_likes" to "anon";

grant delete on table "public"."video_likes" to "authenticated";

grant insert on table "public"."video_likes" to "authenticated";

grant references on table "public"."video_likes" to "authenticated";

grant select on table "public"."video_likes" to "authenticated";

grant trigger on table "public"."video_likes" to "authenticated";

grant truncate on table "public"."video_likes" to "authenticated";

grant update on table "public"."video_likes" to "authenticated";

grant delete on table "public"."video_likes" to "service_role";

grant insert on table "public"."video_likes" to "service_role";

grant references on table "public"."video_likes" to "service_role";

grant select on table "public"."video_likes" to "service_role";

grant trigger on table "public"."video_likes" to "service_role";

grant truncate on table "public"."video_likes" to "service_role";

grant update on table "public"."video_likes" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."video_collections"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = auth.uid()) AND (profiles.id = video_collections.user_id)))));


create policy "Enable insert for authenticated users only"
on "public"."video_collections"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable users to view their own data only"
on "public"."video_collections"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.id = video_collections.user_id)))));


create policy "Enable delete for users based on user_id"
on "public"."video_likes"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.id = video_likes.user_id)))));


create policy "Enable insert for authenticated users only"
on "public"."video_likes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all auth users"
on "public"."video_likes"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for creator"
on "public"."videos"
as permissive
for update
to authenticated
using (rls_helpers.is_same_user(user_id))
with check (rls_helpers.is_same_user(user_id));


CREATE TRIGGER tr_update_video_likes_count AFTER INSERT OR DELETE ON public.video_likes FOR EACH ROW EXECUTE FUNCTION update_video_likes_count();

CREATE TRIGGER tr_video_likes_autoset_user_id BEFORE INSERT ON public.video_likes FOR EACH ROW EXECUTE FUNCTION set_user_id_value_for_row();




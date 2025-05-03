drop function if exists "public"."create_post_with_tags"(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, tag_names text[]);

create table "public"."user_preferences" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "theme" theme_options default 'system'::theme_options,
    "preferred_language" text default 'en'::text,
    "privacy" privacy_options default 'public'::privacy_options,
    "show_sensitive_content" boolean default false,
    "mark_sensitive_by_default" boolean default false,
    "guided_tour_enabled" boolean default true,
    "auto_save_drafts" boolean default false,
    "daily_prompt_enabled" boolean default false,
    "allow_anonymous_replies" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."user_preferences" enable row level security;

alter table "public"."posts" add column "is_sensitive" boolean not null default false;

alter table "public"."user_verifications" alter column "created_at" set not null;

alter table "public"."user_verifications" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

CREATE UNIQUE INDEX user_preferences_pkey ON public.user_preferences USING btree (id);

CREATE UNIQUE INDEX user_preferences_user_id_key ON public.user_preferences USING btree (user_id);

alter table "public"."user_preferences" add constraint "user_preferences_pkey" PRIMARY KEY using index "user_preferences_pkey";

alter table "public"."user_preferences" add constraint "user_preferences_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_preferences" validate constraint "user_preferences_user_id_fkey";

alter table "public"."user_preferences" add constraint "user_preferences_user_id_key" UNIQUE using index "user_preferences_user_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_post_with_tags(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp without time zone, tag_names text[], is_sensitive boolean)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
    post_id UUID;
    tag_id BIGINT;
    tag_name TEXT;
BEGIN
    -- Insert the post
    INSERT INTO Posts (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive  -- 🔥 New Column
    )
    VALUES (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive
    )
    RETURNING id INTO post_id;

    -- Process tags if any
    IF array_length(tag_names, 1) > 0 THEN
        FOREACH tag_name IN ARRAY tag_names LOOP
            -- Insert or update tag usage
            INSERT INTO Tags (name, post)
            VALUES (tag_name, 1)
            ON CONFLICT (name) DO UPDATE
            SET post = Tags.post + 1
            RETURNING id INTO tag_id;

            -- Link tag to the post
            INSERT INTO PostTags (tag, post)
            VALUES (tag_id, post_id);
        END LOOP;
    END IF;

    RETURN post_id;

EXCEPTION 
    WHEN OTHERS THEN
        RAISE NOTICE 'Transaction failed: %', SQLERRM;
        RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_post_with_tags_v1(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, tag_names text[])
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
    post_id uuid;
    tag_id bigint;
    tag_name text;
BEGIN
    -- Start a transaction
    RAISE NOTICE 'Starting to create post with content: %', content;

    -- Insert the post
    INSERT INTO Posts (content, mood, expires_in_24hr, duration, expires_at)
    VALUES (content, mood, expires_in_24hr, duration, expires_at)
    RETURNING id INTO post_id;

    RAISE NOTICE 'Post created with ID: %', post_id;

     -- Process tags if any
    IF array_length(tag_names, 1) > 0 THEN
     FOREACH tag_name IN ARRAY tag_names
     LOOP
        -- Check if the tag already exists
        INSERT INTO Tags (name, post)
        VALUES (tag_name, 1)
        ON CONFLICT (name)
        DO UPDATE SET post = Tags.post + 1
        RETURNING id INTO tag_id;

        -- Insert into PostTags
        INSERT INTO PostTags (tag, post) VALUES (tag_id, post_id);
        RAISE NOTICE 'PostTag created for post_id: % and tag_id: %', post_id, tag_id;
     END LOOP;
    END IF;

    -- Return the post_id
    RETURN post_id;

EXCEPTION 
    WHEN OTHERS THEN
        -- Rollback transaction in case of error
        RAISE NOTICE 'Transaction failed: %', SQLERRM;
        RETURN NULL;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_profile_preferences()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_user_preferences_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."user_preferences" to "anon";

grant insert on table "public"."user_preferences" to "anon";

grant references on table "public"."user_preferences" to "anon";

grant select on table "public"."user_preferences" to "anon";

grant trigger on table "public"."user_preferences" to "anon";

grant truncate on table "public"."user_preferences" to "anon";

grant update on table "public"."user_preferences" to "anon";

grant delete on table "public"."user_preferences" to "authenticated";

grant insert on table "public"."user_preferences" to "authenticated";

grant references on table "public"."user_preferences" to "authenticated";

grant select on table "public"."user_preferences" to "authenticated";

grant trigger on table "public"."user_preferences" to "authenticated";

grant truncate on table "public"."user_preferences" to "authenticated";

grant update on table "public"."user_preferences" to "authenticated";

grant delete on table "public"."user_preferences" to "service_role";

grant insert on table "public"."user_preferences" to "service_role";

grant references on table "public"."user_preferences" to "service_role";

grant select on table "public"."user_preferences" to "service_role";

grant trigger on table "public"."user_preferences" to "service_role";

grant truncate on table "public"."user_preferences" to "service_role";

grant update on table "public"."user_preferences" to "service_role";

create policy "Allow user to access only his own preference "
on "public"."user_preferences"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = auth.uid()) AND (profiles.id = user_preferences.user_id)))));


create policy "Allow user to only update his preferences"
on "public"."user_preferences"
as permissive
for update
to authenticated
using (rls_helpers.is_same_user(user_id))
with check (rls_helpers.is_same_user(user_id));


create policy "Enable insert for only authenticated users "
on "public"."user_preferences"
as permissive
for insert
to authenticated
with check (true);


CREATE TRIGGER tr_create_preferences_on_new_profile AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION handle_new_profile_preferences();

CREATE TRIGGER trg_set_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION set_user_preferences_updated_at();




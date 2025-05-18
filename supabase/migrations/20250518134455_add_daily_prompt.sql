drop function if exists "public"."create_post_with_tags"(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp without time zone, tag_names text[], is_sensitive boolean);

create table "public"."daily_prompts" (
    "id" uuid not null default gen_random_uuid(),
    "prompt_text" text not null,
    "created_by" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "active_on" date not null,
    "is_active" boolean default false
);


alter table "public"."daily_prompts" enable row level security;

create table "public"."prompt_responses" (
    "id" uuid not null default gen_random_uuid(),
    "post_id" uuid not null,
    "prompt_id" uuid not null,
    "responded_at" timestamp with time zone default now(),
    "user_id" uuid
);


alter table "public"."prompt_responses" enable row level security;

create table "public"."prompt_streaks" (
    "user_id" uuid not null,
    "current_streak" integer not null default 0,
    "longest_streak" integer not null default 0,
    "last_response_date" date,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."prompt_streaks" enable row level security;

alter table "public"."posts" add column "is_prompt_response" boolean not null default false;

CREATE UNIQUE INDEX daily_prompts_pkey ON public.daily_prompts USING btree (id);

CREATE INDEX idx_daily_prompts_active_on ON public.daily_prompts USING btree (active_on);

CREATE UNIQUE INDEX idx_unique_prompt_per_day ON public.daily_prompts USING btree (active_on);

CREATE UNIQUE INDEX prompt_responses_pkey ON public.prompt_responses USING btree (id);

CREATE UNIQUE INDEX prompt_responses_post_id_key ON public.prompt_responses USING btree (post_id);

CREATE UNIQUE INDEX prompt_responses_post_id_prompt_id_key ON public.prompt_responses USING btree (post_id, prompt_id);

CREATE UNIQUE INDEX prompt_streaks_pkey ON public.prompt_streaks USING btree (user_id);

CREATE UNIQUE INDEX prompt_streaks_user_id_key ON public.prompt_streaks USING btree (user_id);

alter table "public"."daily_prompts" add constraint "daily_prompts_pkey" PRIMARY KEY using index "daily_prompts_pkey";

alter table "public"."prompt_responses" add constraint "prompt_responses_pkey" PRIMARY KEY using index "prompt_responses_pkey";

alter table "public"."prompt_streaks" add constraint "prompt_streaks_pkey" PRIMARY KEY using index "prompt_streaks_pkey";

alter table "public"."daily_prompts" add constraint "daily_prompts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."daily_prompts" validate constraint "daily_prompts_created_by_fkey";

alter table "public"."prompt_responses" add constraint "prompt_responses_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE not valid;

alter table "public"."prompt_responses" validate constraint "prompt_responses_post_id_fkey";

alter table "public"."prompt_responses" add constraint "prompt_responses_post_id_key" UNIQUE using index "prompt_responses_post_id_key";

alter table "public"."prompt_responses" add constraint "prompt_responses_post_id_prompt_id_key" UNIQUE using index "prompt_responses_post_id_prompt_id_key";

alter table "public"."prompt_responses" add constraint "prompt_responses_prompt_id_fkey" FOREIGN KEY (prompt_id) REFERENCES daily_prompts(id) ON DELETE CASCADE not valid;

alter table "public"."prompt_responses" validate constraint "prompt_responses_prompt_id_fkey";

alter table "public"."prompt_responses" add constraint "prompt_responses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."prompt_responses" validate constraint "prompt_responses_user_id_fkey";

alter table "public"."prompt_streaks" add constraint "prompt_streaks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."prompt_streaks" validate constraint "prompt_streaks_user_id_fkey";

alter table "public"."prompt_streaks" add constraint "prompt_streaks_user_id_key" UNIQUE using index "prompt_streaks_user_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_post_with_tags(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp with time zone, tag_names text[], is_sensitive boolean DEFAULT false, is_prompt_response boolean DEFAULT false)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
    post_id UUID;
    tag_id BIGINT;
    tag_name TEXT;
BEGIN
    -- Insert the post
    INSERT INTO posts (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive,
        is_prompt_response
    )
    VALUES (
        content,
        mood,
        expires_in_24hr,
        duration,
        expires_at,
        is_sensitive,
        is_prompt_response
    )
    RETURNING id INTO post_id;

    -- Process and attach tags if provided
    IF array_length(tag_names, 1) > 0 THEN
        FOREACH tag_name IN ARRAY tag_names LOOP
            -- Insert new tag or update usage count if exists
            INSERT INTO tags (name, post)
            VALUES (tag_name, 1)
            ON CONFLICT (name) DO UPDATE
            SET post = tags.post + 1
            RETURNING id INTO tag_id;

            -- Link tag to post
            INSERT INTO posttags (tag, post)
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

CREATE OR REPLACE FUNCTION public.create_post_with_tags_v2(content text, mood post_mood, expires_in_24hr boolean, duration post_duration, expires_at timestamp without time zone, tag_names text[], is_sensitive boolean)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_prompt_streak()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  today date := current_date;
  yesterday date := current_date - interval '1 day';
  streak_record prompt_streaks;
begin
  select * into streak_record from prompt_streaks where user_id = new.user_id;

  if not found then
    -- First ever prompt response
    insert into prompt_streaks (user_id, current_streak, longest_streak, last_response_date, updated_at)
    values (new.user_id, 1, 1, today, now());

  elsif streak_record.last_response_date = today then
    -- Already responded today; do nothing
    return new;

  elsif streak_record.last_response_date = yesterday then
    -- Continue streak
    update prompt_streaks
    set
      current_streak = streak_record.current_streak + 1,
      longest_streak = greatest(streak_record.longest_streak, streak_record.current_streak + 1),
      last_response_date = today,
      updated_at = now()
    where user_id = new.user_id;

  else
    -- Missed a day: reset streak
    update prompt_streaks
    set
      current_streak = 1,
      longest_streak = greatest(streak_record.longest_streak, 1),
      last_response_date = today,
      updated_at = now()
    where user_id = new.user_id;
  end if;

  return new;
end;
$function$
;

grant delete on table "public"."daily_prompts" to "anon";

grant insert on table "public"."daily_prompts" to "anon";

grant references on table "public"."daily_prompts" to "anon";

grant select on table "public"."daily_prompts" to "anon";

grant trigger on table "public"."daily_prompts" to "anon";

grant truncate on table "public"."daily_prompts" to "anon";

grant update on table "public"."daily_prompts" to "anon";

grant delete on table "public"."daily_prompts" to "authenticated";

grant insert on table "public"."daily_prompts" to "authenticated";

grant references on table "public"."daily_prompts" to "authenticated";

grant select on table "public"."daily_prompts" to "authenticated";

grant trigger on table "public"."daily_prompts" to "authenticated";

grant truncate on table "public"."daily_prompts" to "authenticated";

grant update on table "public"."daily_prompts" to "authenticated";

grant delete on table "public"."daily_prompts" to "service_role";

grant insert on table "public"."daily_prompts" to "service_role";

grant references on table "public"."daily_prompts" to "service_role";

grant select on table "public"."daily_prompts" to "service_role";

grant trigger on table "public"."daily_prompts" to "service_role";

grant truncate on table "public"."daily_prompts" to "service_role";

grant update on table "public"."daily_prompts" to "service_role";

grant delete on table "public"."prompt_responses" to "anon";

grant insert on table "public"."prompt_responses" to "anon";

grant references on table "public"."prompt_responses" to "anon";

grant select on table "public"."prompt_responses" to "anon";

grant trigger on table "public"."prompt_responses" to "anon";

grant truncate on table "public"."prompt_responses" to "anon";

grant update on table "public"."prompt_responses" to "anon";

grant delete on table "public"."prompt_responses" to "authenticated";

grant insert on table "public"."prompt_responses" to "authenticated";

grant references on table "public"."prompt_responses" to "authenticated";

grant select on table "public"."prompt_responses" to "authenticated";

grant trigger on table "public"."prompt_responses" to "authenticated";

grant truncate on table "public"."prompt_responses" to "authenticated";

grant update on table "public"."prompt_responses" to "authenticated";

grant delete on table "public"."prompt_responses" to "service_role";

grant insert on table "public"."prompt_responses" to "service_role";

grant references on table "public"."prompt_responses" to "service_role";

grant select on table "public"."prompt_responses" to "service_role";

grant trigger on table "public"."prompt_responses" to "service_role";

grant truncate on table "public"."prompt_responses" to "service_role";

grant update on table "public"."prompt_responses" to "service_role";

grant delete on table "public"."prompt_streaks" to "anon";

grant insert on table "public"."prompt_streaks" to "anon";

grant references on table "public"."prompt_streaks" to "anon";

grant select on table "public"."prompt_streaks" to "anon";

grant trigger on table "public"."prompt_streaks" to "anon";

grant truncate on table "public"."prompt_streaks" to "anon";

grant update on table "public"."prompt_streaks" to "anon";

grant delete on table "public"."prompt_streaks" to "authenticated";

grant insert on table "public"."prompt_streaks" to "authenticated";

grant references on table "public"."prompt_streaks" to "authenticated";

grant select on table "public"."prompt_streaks" to "authenticated";

grant trigger on table "public"."prompt_streaks" to "authenticated";

grant truncate on table "public"."prompt_streaks" to "authenticated";

grant update on table "public"."prompt_streaks" to "authenticated";

grant delete on table "public"."prompt_streaks" to "service_role";

grant insert on table "public"."prompt_streaks" to "service_role";

grant references on table "public"."prompt_streaks" to "service_role";

grant select on table "public"."prompt_streaks" to "service_role";

grant trigger on table "public"."prompt_streaks" to "service_role";

grant truncate on table "public"."prompt_streaks" to "service_role";

grant update on table "public"."prompt_streaks" to "service_role";

create policy "Enable read access for authenticated users"
on "public"."daily_prompts"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."feedbacks"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."prompt_responses"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users"
on "public"."prompt_responses"
as permissive
for select
to authenticated
using (true);


create policy "Allow user to see his own streak"
on "public"."prompt_streaks"
as permissive
for select
to authenticated
using (rls_helpers.is_same_user(user_id));


create policy "Enable insert for authenticated users only"
on "public"."prompt_streaks"
as permissive
for insert
to authenticated
with check (true);


create policy "Users can update their own streak"
on "public"."prompt_streaks"
as permissive
for update
to public
using (rls_helpers.is_same_user(user_id))
with check (rls_helpers.is_same_user(user_id));


CREATE TRIGGER tr_update_prompt_streak AFTER INSERT ON public.prompt_responses FOR EACH ROW EXECUTE FUNCTION handle_prompt_streak();




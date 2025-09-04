create sequence "public"."campfire_guide_resources_id_seq";

create table "public"."campfire_guide_resources" (
    "id" bigint not null default nextval('campfire_guide_resources_id_seq'::regclass),
    "campfire_id" uuid not null,
    "label" text not null,
    "url" text,
    "sort_order" integer default 0,
    "created_at" timestamp with time zone default now()
);


alter table "public"."campfires" add column "guide_enabled" boolean default true;

alter table "public"."campfires" add column "guide_header_image" text default 'Banner'::text;

alter table "public"."campfires" add column "guide_header_layout" text default 'Avatar and name'::text;

alter table "public"."campfires" add column "guide_show_on_join" boolean default false;

alter table "public"."campfires" add column "guide_welcome_message" text default 'Welcome to our campfire, {username}!'::text;

alter sequence "public"."campfire_guide_resources_id_seq" owned by "public"."campfire_guide_resources"."id";

CREATE UNIQUE INDEX campfire_guide_resources_pkey ON public.campfire_guide_resources USING btree (id);

CREATE INDEX idx_campfire_guide_resources_campfire_id ON public.campfire_guide_resources USING btree (campfire_id, sort_order);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

alter table "public"."campfire_guide_resources" add constraint "campfire_guide_resources_pkey" PRIMARY KEY using index "campfire_guide_resources_pkey";

alter table "public"."campfire_guide_resources" add constraint "campfire_guide_resources_campfire_id_fkey" FOREIGN KEY (campfire_id) REFERENCES campfires(id) ON DELETE CASCADE not valid;

alter table "public"."campfire_guide_resources" validate constraint "campfire_guide_resources_campfire_id_fkey";

alter table "public"."campfire_guide_resources" add constraint "check_label_length" CHECK (((char_length(label) > 0) AND (char_length(label) <= 100))) not valid;

alter table "public"."campfire_guide_resources" validate constraint "check_label_length";

alter table "public"."campfire_guide_resources" add constraint "check_url_length" CHECK (((url IS NULL) OR (char_length(url) <= 2048))) not valid;

alter table "public"."campfire_guide_resources" validate constraint "check_url_length";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_max_guide_resources()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  IF (SELECT COUNT(*) FROM public.campfire_guide_resources WHERE campfire_id = NEW.campfire_id) >= 3 THEN
    RAISE EXCEPTION 'Maximum 3 resources allowed per campfire guide';
  END IF;
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."campfire_guide_resources" to "anon";

grant insert on table "public"."campfire_guide_resources" to "anon";

grant references on table "public"."campfire_guide_resources" to "anon";

grant select on table "public"."campfire_guide_resources" to "anon";

grant trigger on table "public"."campfire_guide_resources" to "anon";

grant truncate on table "public"."campfire_guide_resources" to "anon";

grant update on table "public"."campfire_guide_resources" to "anon";

grant delete on table "public"."campfire_guide_resources" to "authenticated";

grant insert on table "public"."campfire_guide_resources" to "authenticated";

grant references on table "public"."campfire_guide_resources" to "authenticated";

grant select on table "public"."campfire_guide_resources" to "authenticated";

grant trigger on table "public"."campfire_guide_resources" to "authenticated";

grant truncate on table "public"."campfire_guide_resources" to "authenticated";

grant update on table "public"."campfire_guide_resources" to "authenticated";

grant delete on table "public"."campfire_guide_resources" to "service_role";

grant insert on table "public"."campfire_guide_resources" to "service_role";

grant references on table "public"."campfire_guide_resources" to "service_role";

grant select on table "public"."campfire_guide_resources" to "service_role";

grant trigger on table "public"."campfire_guide_resources" to "service_role";

grant truncate on table "public"."campfire_guide_resources" to "service_role";

grant update on table "public"."campfire_guide_resources" to "service_role";

CREATE TRIGGER tr_check_max_guide_resources BEFORE INSERT ON public.campfire_guide_resources FOR EACH ROW EXECUTE FUNCTION check_max_guide_resources();




create type "public"."privacy_options" as enum ('public', 'private', 'followers_only');

create type "public"."theme_options" as enum ('system', 'light', 'dark');

create type "public"."verification_method" as enum ('manual', 'subscription', 'promo');

create table "public"."user_verifications" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "verified" boolean not null default false,
    "verified_by" uuid,
    "reason" text,
    "method" verification_method not null default 'manual'::verification_method,
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."profiles" add column "email" text;

alter table "public"."profiles" add column "is_verified" boolean not null default false;

CREATE UNIQUE INDEX user_verifications_pkey ON public.user_verifications USING btree (id);

alter table "public"."user_verifications" add constraint "user_verifications_pkey" PRIMARY KEY using index "user_verifications_pkey";

alter table "public"."user_verifications" add constraint "user_verifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_verifications" validate constraint "user_verifications_user_id_fkey";

alter table "public"."user_verifications" add constraint "user_verifications_verified_by_fkey" FOREIGN KEY (verified_by) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."user_verifications" validate constraint "user_verifications_verified_by_fkey";

grant delete on table "public"."user_verifications" to "anon";

grant insert on table "public"."user_verifications" to "anon";

grant references on table "public"."user_verifications" to "anon";

grant select on table "public"."user_verifications" to "anon";

grant trigger on table "public"."user_verifications" to "anon";

grant truncate on table "public"."user_verifications" to "anon";

grant update on table "public"."user_verifications" to "anon";

grant delete on table "public"."user_verifications" to "authenticated";

grant insert on table "public"."user_verifications" to "authenticated";

grant references on table "public"."user_verifications" to "authenticated";

grant select on table "public"."user_verifications" to "authenticated";

grant trigger on table "public"."user_verifications" to "authenticated";

grant truncate on table "public"."user_verifications" to "authenticated";

grant update on table "public"."user_verifications" to "authenticated";

grant delete on table "public"."user_verifications" to "service_role";

grant insert on table "public"."user_verifications" to "service_role";

grant references on table "public"."user_verifications" to "service_role";

grant select on table "public"."user_verifications" to "service_role";

grant trigger on table "public"."user_verifications" to "service_role";

grant truncate on table "public"."user_verifications" to "service_role";

grant update on table "public"."user_verifications" to "service_role";




create type "public"."post_duration" as enum ('6', '12', '24');

alter table "public"."posts" add column "duration" post_duration;

alter table "public"."posts" add column "expires_at" timestamp with time zone;




alter table "public"."health_tips" add column "excerpt" text;

alter table "public"."health_tips" add column "read_time" integer not null default 5;

alter table "public"."health_tips" add column "topic" text not null default 'general'::text;




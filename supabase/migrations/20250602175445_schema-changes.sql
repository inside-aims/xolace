alter table "public"."reports" drop constraint "reports_reported_by_fkey";

alter table "public"."comments" alter column "created_by" drop not null;

alter table "public"."posts" alter column "created_by" drop not null;

alter table "public"."profiles" add column "consent_version" integer not null default 0;

alter table "public"."profiles" add column "has_consented" boolean not null default false;

alter table "public"."reports" add constraint "reports_reported_by_fkey" FOREIGN KEY (reported_by) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."reports" validate constraint "reports_reported_by_fkey";




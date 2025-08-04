alter table "public"."health_professionals" add column "agree_terms" boolean not null default false;

alter table "public"."health_professionals" add column "confirm_accuracy" boolean not null default false;

alter table "public"."health_professionals" add column "consent_processing" boolean not null default false;

alter table "public"."health_professionals" add column "contact" text;

alter table "public"."health_professionals" add column "language" text;

alter table "public"."health_professionals" add column "location" text;

alter table "public"."health_professionals" add column "title" text not null;

alter table "public"."health_professionals" add column "understand_review" boolean not null default false;

alter table "public"."health_professionals" alter column "verified_by_admin" set not null;

alter table "public"."health_professionals" alter column "years_of_experience" set not null;




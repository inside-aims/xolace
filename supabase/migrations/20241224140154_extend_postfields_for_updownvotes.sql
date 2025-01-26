alter table "public"."posts" add column "downvotes" integer not null default 0;

alter table "public"."posts" add column "upvotes" integer not null default 0;

alter table "public"."posts" add column "views" bigint not null default '0'::bigint;




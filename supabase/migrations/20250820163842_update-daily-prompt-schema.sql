alter table "public"."comments" add column "campfire_id" uuid;

alter table "public"."daily_prompts" add column "category" text not null default 'thoughtful'::text;

alter table "public"."comments" add constraint "comments_campfire_id_fkey" FOREIGN KEY (campfire_id) REFERENCES campfires(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_campfire_id_fkey";




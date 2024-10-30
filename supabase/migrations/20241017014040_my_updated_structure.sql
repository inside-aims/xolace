drop trigger if exists "tr_comments_autoset_author_name" on "public"."comments";

drop trigger if exists "tr_comments_autoset_created_by" on "public"."comments";

drop trigger if exists "tr_posts_autoset_author_name" on "public"."posts";

drop policy "Allow all auth users to add " on "public"."comments";

drop policy "Enable users to view their own data only" on "public"."comments";

drop policy "allow to delete comment if has created" on "public"."comments";

drop policy "allow to update user created it" on "public"."comments";

revoke delete on table "public"."comments" from "anon";

revoke insert on table "public"."comments" from "anon";

revoke references on table "public"."comments" from "anon";

revoke select on table "public"."comments" from "anon";

revoke trigger on table "public"."comments" from "anon";

revoke truncate on table "public"."comments" from "anon";

revoke update on table "public"."comments" from "anon";

revoke delete on table "public"."comments" from "authenticated";

revoke insert on table "public"."comments" from "authenticated";

revoke references on table "public"."comments" from "authenticated";

revoke select on table "public"."comments" from "authenticated";

revoke trigger on table "public"."comments" from "authenticated";

revoke truncate on table "public"."comments" from "authenticated";

revoke update on table "public"."comments" from "authenticated";

revoke delete on table "public"."comments" from "service_role";

revoke insert on table "public"."comments" from "service_role";

revoke references on table "public"."comments" from "service_role";

revoke select on table "public"."comments" from "service_role";

revoke trigger on table "public"."comments" from "service_role";

revoke truncate on table "public"."comments" from "service_role";

revoke update on table "public"."comments" from "service_role";

alter table "public"."comments" drop constraint "comments_created_by_fkey";

alter table "public"."comments" drop constraint "comments_post_fkey1";

alter table "public"."posts" drop constraint "posts_created_by_fkey";

drop function if exists "public"."set_author_name_and_author_avatar"();

alter table "public"."comments" drop constraint "comments_pkey";

drop index if exists "public"."comments_pkey";

drop table "public"."comments";

alter table "public"."posts" add constraint "posts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."posts" validate constraint "posts_created_by_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_post_author_name_and_author_avatar()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW.author_name = (SELECT username FROM profiles WHERE supabase_user = auth.uid());
  NEW.author_avatar_url = (SELECT avatar_url FROM profiles WHERE supabase_user = auth.uid());
  RETURN NEW;
END;$function$
;

CREATE TRIGGER tr_posts_autoset_author_name BEFORE INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION set_post_author_name_and_author_avatar();



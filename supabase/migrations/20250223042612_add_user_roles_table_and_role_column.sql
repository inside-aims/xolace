create type "public"."user_role" as enum ('normal_user', 'verified', 'moderator', 'help_professional');

create table "public"."user_roles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "role" user_role not null default 'normal_user'::user_role,
    "assigned_at" timestamp without time zone default now()
);


alter table "public"."user_roles" enable row level security;

alter table "public"."profiles" add column "role" user_role not null default 'normal_user'::user_role;

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);

CREATE UNIQUE INDEX idx_user_roles_user_id_role ON public.user_roles USING btree (user_id, role);

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (id);

CREATE UNIQUE INDEX user_roles_user_id_role_key ON public.user_roles USING btree (user_id, role);

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "user_roles_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_role_key" UNIQUE using index "user_roles_user_id_role_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.assign_default_role()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'normal_user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";

create policy "Allow trigger insert"
on "public"."user_roles"
as permissive
for insert
to supabase_admin, authenticated
with check (true);


create policy "Enable delete for users based on user_id"
on "public"."user_roles"
as permissive
for delete
to authenticated
using ((user_id = ( SELECT p.id
   FROM profiles p
  WHERE (p.supabase_user = auth.uid()))));


create policy "Only mods can delete roles"
on "public"."user_roles"
as permissive
for delete
to public
using ((( SELECT profiles.role
   FROM profiles
  WHERE (profiles.supabase_user = auth.uid())) = 'moderator'::user_role));


create policy "Users can view their own roles, mods see all"
on "public"."user_roles"
as permissive
for select
to public
using (((user_id = ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.supabase_user = auth.uid()))) OR (( SELECT profiles.role
   FROM profiles
  WHERE (profiles.supabase_user = auth.uid())) = 'moderator'::user_role)));


CREATE TRIGGER tr_assign_default_role AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION assign_default_role();




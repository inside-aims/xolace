alter table "public"."reports" add column "description" text;

alter table "public"."reports" add column "severity" smallint default '1'::smallint;

alter table "public"."reports" enable row level security;

alter table "public"."reports" add constraint "reports_description_check" CHECK ((length(description) < 200)) not valid;

alter table "public"."reports" validate constraint "reports_description_check";

create policy "Enable insert for authenticated users only"
on "public"."reports"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable users to view their own data only"
on "public"."reports"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = reported_by));




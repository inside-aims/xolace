create type "public"."feedback_status" as enum ('open', 'closed');

drop policy "Enable read access for authenticated users" on "public"."posts";

alter table "public"."feedbacks" add column "status" feedback_status not null default 'open'::feedback_status;

alter table "public"."posts" add column "expires_in_24hr" boolean not null default false;




create policy "Enable read access for authenticated users"
on "public"."posts"
as permissive
for select
to authenticated
using (((expires_in_24hr = false) OR ((expires_in_24hr = true) AND (created_at > (CURRENT_TIMESTAMP - '1 day'::interval)))));





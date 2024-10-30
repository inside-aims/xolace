create policy "Enable update for users based on anonymous claim"
on "public"."profiles"
as restrictive
for update
to authenticated
using ((( SELECT ((auth.jwt() ->> 'is_anonymous'::text))::boolean AS bool) IS FALSE))
with check ((( SELECT ((auth.jwt() ->> 'is_anonymous'::text))::boolean AS bool) IS FALSE));




CREATE INDEX idx_campfire_members_campfire_id_role ON public.campfire_members USING btree (campfire_id, role);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_campfire_members_by_roles(p_campfire_id uuid, p_roles campfire_role[], p_limit integer DEFAULT NULL::integer)
 RETURNS TABLE(user_id uuid, username text, avatar_url text, role campfire_role)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  IF p_limit IS NULL THEN
    RETURN QUERY
    SELECT
      p.id AS user_id,
      p.username,
      p.avatar_url,
      cm.role
    FROM
      public.campfire_members AS cm
    JOIN
      public.profiles AS p ON cm.user_id = p.id
    WHERE
      cm.campfire_id = p_campfire_id
      AND cm.role = ANY (p_roles)
    ORDER BY
      cm.role, p.username;
  ELSE
    RETURN QUERY
    SELECT
      p.id AS user_id,
      p.username,
      p.avatar_url,
      cm.role
    FROM
      public.campfire_members AS cm
    JOIN
      public.profiles AS p ON cm.user_id = p.id
    WHERE
      cm.campfire_id = p_campfire_id
      AND cm.role = ANY (p_roles)
    ORDER BY
      cm.role, p.username
    LIMIT p_limit;
  END IF;
END;
$function$
;

create policy "Allow view access to all auth users"
on "public"."campfire_rules"
as permissive
for select
to authenticated
using (true);





create table "public"."highlighted_feed_content" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text not null,
    "image_url" text not null,
    "badge_text" text,
    "health_tip_link" text,
    "glimpse_link" text,
    "source_label" text not null default 'Xolace Health Team'::text,
    "campaign_name" text,
    "campaign_type" text,
    "start_date" timestamp with time zone not null,
    "end_date" timestamp with time zone not null,
    "is_active" boolean not null default true,
    "priority" integer not null default 0,
    "health_tip_clicks" integer not null default 0,
    "glimpse_clicks" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "theme_color" text not null default 'pink'::text
);


alter table "public"."highlighted_feed_content" enable row level security;

CREATE UNIQUE INDEX highlighted_feed_content_pkey ON public.highlighted_feed_content USING btree (id);

CREATE INDEX idx_highlighted_active_dates ON public.highlighted_feed_content USING btree (is_active, start_date, end_date) WHERE (is_active = true);

CREATE INDEX idx_highlighted_campaign ON public.highlighted_feed_content USING btree (campaign_type, campaign_name);

CREATE INDEX idx_highlighted_date_range ON public.highlighted_feed_content USING btree (start_date, end_date);

CREATE INDEX idx_highlighted_priority ON public.highlighted_feed_content USING btree (priority DESC, created_at DESC) WHERE (is_active = true);

alter table "public"."highlighted_feed_content" add constraint "highlighted_feed_content_pkey" PRIMARY KEY using index "highlighted_feed_content_pkey";

alter table "public"."highlighted_feed_content" add constraint "must_have_at_least_one_link" CHECK (((health_tip_link IS NOT NULL) OR (glimpse_link IS NOT NULL))) not valid;

alter table "public"."highlighted_feed_content" validate constraint "must_have_at_least_one_link";

alter table "public"."highlighted_feed_content" add constraint "valid_date_range" CHECK ((end_date > start_date)) not valid;

alter table "public"."highlighted_feed_content" validate constraint "valid_date_range";

alter table "public"."highlighted_feed_content" add constraint "valid_priority" CHECK ((priority >= 0)) not valid;

alter table "public"."highlighted_feed_content" validate constraint "valid_priority";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_active_highlighted_content()
 RETURNS SETOF highlighted_feed_content
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.highlighted_feed_content
  WHERE is_active = true
    AND NOW() BETWEEN start_date AND end_date
  ORDER BY priority DESC, created_at DESC;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.track_highlight_click(p_highlight_id uuid, p_click_type text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  IF p_click_type = 'health_tip' THEN
    UPDATE public.highlighted_feed_content
    SET health_tip_clicks = health_tip_clicks + 1
    WHERE id = p_highlight_id;
  ELSIF p_click_type = 'glimpse' THEN
    UPDATE public.highlighted_feed_content
    SET glimpse_clicks = glimpse_clicks + 1
    WHERE id = p_highlight_id;
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_highlighted_content_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."highlighted_feed_content" to "anon";

grant insert on table "public"."highlighted_feed_content" to "anon";

grant references on table "public"."highlighted_feed_content" to "anon";

grant select on table "public"."highlighted_feed_content" to "anon";

grant trigger on table "public"."highlighted_feed_content" to "anon";

grant truncate on table "public"."highlighted_feed_content" to "anon";

grant update on table "public"."highlighted_feed_content" to "anon";

grant delete on table "public"."highlighted_feed_content" to "authenticated";

grant insert on table "public"."highlighted_feed_content" to "authenticated";

grant references on table "public"."highlighted_feed_content" to "authenticated";

grant select on table "public"."highlighted_feed_content" to "authenticated";

grant trigger on table "public"."highlighted_feed_content" to "authenticated";

grant truncate on table "public"."highlighted_feed_content" to "authenticated";

grant update on table "public"."highlighted_feed_content" to "authenticated";

grant delete on table "public"."highlighted_feed_content" to "service_role";

grant insert on table "public"."highlighted_feed_content" to "service_role";

grant references on table "public"."highlighted_feed_content" to "service_role";

grant select on table "public"."highlighted_feed_content" to "service_role";

grant trigger on table "public"."highlighted_feed_content" to "service_role";

grant truncate on table "public"."highlighted_feed_content" to "service_role";

grant update on table "public"."highlighted_feed_content" to "service_role";

create policy "Public can view active highlights"
on "public"."highlighted_feed_content"
as permissive
for select
to public
using (((is_active = true) AND ((now() >= start_date) AND (now() <= end_date))));


CREATE TRIGGER tr_highlighted_content_updated_at BEFORE UPDATE ON public.highlighted_feed_content FOR EACH ROW EXECUTE FUNCTION update_highlighted_content_updated_at();




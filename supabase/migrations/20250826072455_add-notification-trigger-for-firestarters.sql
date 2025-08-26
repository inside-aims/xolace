set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_firestarter_welcome_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    -- Define variables to hold the JSONB data
    _notification_metadata jsonb;
    _author_name text := 'Xolace Team'; -- Default system author name
    _author_avatar_url text := 'https://qdjrwasidlmgqxakdxkl.supabase.co/storage/v1/object/public/xolace.bucket//xolace-health.png'; -- Default system avatar URL
BEGIN
    -- Construct the JSONB metadata for the welcome notification
    _notification_metadata := jsonb_build_object( -- jsonb_build_object is in pg_catalog
        'icon', '🔥', -- Fire emoji for campfire
        'tags', jsonb_build_array('welcome', 'firestarter'),
        'title', 'Welcome to your new Campfire! 🔥',
        'author', 'Xolace Team',
        'content',
          '<h3>Conversations just got deeper. ✨</h3>' ||
          '<p>Welcome @' || NEW.name || '! Your Campfire is live and ready.</p>' ||
          '<h4>Here’s how to get started:</h4>' ||
          '<ul>' ||
          '<li>🌱 <strong>Set the tone</strong>: Write a warm welcome post to spark your first discussions.</li>' ||
          '<li>🛡️ <strong>Guide the vibe</strong>: Encourage openness, kindness, and respect around your fire.</li>' ||
          '<li>🤝 <strong>Lean on others</strong>: You’re not alone — Firekeepers and Campers can join in to help.</li>' ||
          '</ul>' ||
          '<p>Here are three helpful resources to kick things off:</p>' ||
          '<ul>' ||
          '<li>🪩 <a href="https://xolace.app/x/firestarters">Join x/FireStarters</a> for advice and motivation from other new fireStarters.</li>' ||
          '<li>📘 Check our <a href="https://xolace.app/help-center">Help Center</a> for tips and best practices.</li>' ||
          '<li>✨ Explore other Campfires for inspiration on how to engage your community.</li>' ||
          '</ul>' ||
          '<p>We’re excited to see the sparks you’ll ignite. Welcome to the circle, Firestarter. 🔥</p>' ||
          '<p>#LeadWithCare #CampfireSpirit</p>',
         'category', 'community',
        'priority', 'medium',
        'action_url', format('/x/%s', NEW.slug), -- Link directly to the campfire page
        'description', 'You are officially a Firestarter! 🚀',
        'estimated_read_time', '1 min read'
    );

    -- Insert the welcome notification into the notifications table
    INSERT INTO public.notifications ( -- Qualify 'notifications' table
        recipient_user_id,
        type,
        actor_id, -- Set to null or a system user ID if you have one
        author_name,
        author_avatar_url,
        metadata
    ) VALUES (
        NEW.created_by, -- NEW.id refers to the ID of the newly created user in profiles
        'system_announcement', -- Use the appropriate enum value
        NULL, -- No specific actor for a system welcome notification
        _author_name,
        _author_avatar_url, -- A generic system avatar URL
        _notification_metadata
    );

    RETURN NEW; -- Important: always return NEW for AFTER triggers
END;
$function$
;

create policy "Enable delete for users based on recipient user_id"
on "public"."notifications"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.supabase_user = ( SELECT auth.uid() AS uid)) AND (profiles.id = notifications.recipient_user_id)))));


CREATE TRIGGER tr_new_firestarter_welcome_notification AFTER INSERT ON public.campfires FOR EACH ROW EXECUTE FUNCTION handle_new_firestarter_welcome_notification();




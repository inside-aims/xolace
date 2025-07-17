

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user_welcome_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    -- Define variables to hold the JSONB data
    _notification_metadata jsonb;
BEGIN
    -- Construct the JSONB metadata for the welcome notification
    _notification_metadata := jsonb_build_object(
        'icon', '👋', -- Waving hand emoji for welcome
        'tags', jsonb_build_array('welcome', 'onboarding'),
        'title', 'Welcome to Xolace!',
        'author', 'Xolace Team',
        'content', 'We''re thrilled to have you join our community! Explore inspiring content, connect with others, and share your journey. If you need any help, check out our FAQ or contact support.',
        'category', 'welcome',
        'priority', 'low',
        'action_url', '/feed', -- Or '/onboarding-guide' if you have one
        'description', 'Get started with Xolace!',
        'estimated_read_time', '1 min read'
    );

    -- Insert the welcome notification into the notifications table
    INSERT INTO public.notifications (
        recipient_user_id,
        type,
        actor_id, -- Set to null or a system user ID if you have one
        author_name,
        author_avatar_url,
        metadata
    ) VALUES (
        NEW.id, -- NEW.id refers to the ID of the newly created user in auth.users
        'system_announcement', -- Use the appropriate enum value
        NULL, -- No specific actor for a system welcome notification
        'Xolace Team',
        'https://qdjrwasidlmgqxakdxkl.supabase.co/storage/v1/object/public/xolace.bucket//xolace-health.png', -- A generic system avatar URL
        _notification_metadata
    );

    RETURN NEW; -- Important: always return NEW for AFTER triggers
END;
$function$
;




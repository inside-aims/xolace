drop trigger if exists "tr_notifications_autoset_author_name_avatar" on "public"."notifications";


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_notification_author_details_smarter()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
    _author_username text;
    _author_avatar_url text;
    _current_profile_id uuid; -- To store the profile ID corresponding to auth.uid()
BEGIN
    -- Case 1: If the notification is a 'system_announcement',
    -- we explicitly do NOT want to override any provided author details.
    -- We assume system notifications will have their author details provided directly in the INSERT.
    IF NEW.type = 'system_announcement' THEN
        -- Do nothing, let the provided values (or NULLs if not provided) stand.
        -- If author_name/avatar_url are not provided for system_announcement, they will remain NULL.
        RETURN NEW;
    END IF;

    -- Case 2: For other notification types (user-triggered),
    -- try to fetch author details from the profiles table based on the current authenticated user.
    -- The recipient_user_id of the notification is the profile.id
    -- The actor_id of the notification is the profile.id of the person who triggered it
    -- The author_name/avatar_url here is the *actor's* name/avatar.
    
    -- Get the profile ID corresponding to the authenticated user (auth.uid())
    -- This handles cases where auth.uid() exists (logged-in user)
    -- vs. when it's NULL (e.g., direct dashboard insert by 'postgres' role).
    SELECT id
    INTO _current_profile_id
    FROM public.profiles
    WHERE supabase_user = auth.uid();

    -- Only proceed to auto-set author details if:
    -- 1. There's an authenticated user's profile making the insert (i.e., _current_profile_id IS NOT NULL)
    -- 2. AND the author_name/author_avatar_url fields in the NEW record are currently NULL or empty.
    IF _current_profile_id IS NOT NULL THEN
        -- Fetch the author's details from their profile
        SELECT username, avatar_url
        INTO _author_username, _author_avatar_url
        FROM public.profiles
        WHERE id = _current_profile_id; -- Use profile ID here

        -- Conditionally set author_name if not already provided or is empty
        IF NEW.author_name IS NULL OR NEW.author_name = '' THEN
            NEW.author_name = _author_username;
        END IF;

        -- Conditionally set author_avatar_url if not already provided or is empty
        IF NEW.author_avatar_url IS NULL OR NEW.author_avatar_url = '' THEN
            NEW.author_avatar_url = _author_avatar_url;
        END IF;
        
        -- Also, if actor_id is not set, default it to the current user's profile ID
        IF NEW.actor_id IS NULL THEN
            NEW.actor_id = _current_profile_id;
        END IF;
    END IF;

    RETURN NEW; -- Always return NEW for BEFORE triggers
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user_welcome_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
    -- Define variables to hold the JSONB data
    _notification_metadata jsonb;
    _author_name text := 'Xolace Team'; -- Default system author name
    _author_avatar_url text := 'https://qdjrwasidlmgqxakdxkl.supabase.co/storage/v1/object/public/xolace.bucket//xolace-health.png'; -- Default system avatar URL
BEGIN
    -- Construct the JSONB metadata for the welcome notification
    _notification_metadata := jsonb_build_object(
        'icon', '👋', -- Waving hand emoji for welcome
        'tags', jsonb_build_array('welcome', 'onboarding'),
        'title', 'Welcome to Xolace! Camper🔥',
        'author', 'Xolace Team',
        'content', 'We''re thrilled to have you join our community! Explore inspiring content✨, connect with others, and share your moments, experiences and journey. If you need any help, check out our FAQ or contact support.☎️',
        'category', 'welcome',
        'priority', 'low',
        'action_url', '/feed', -- Or '/onboarding-guide' if you have one
        'description', 'Get started with Xolace! 🪄',
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
        _author_name,
        _author_avatar_url, -- A generic system avatar URL
        _notification_metadata
    );

    RETURN NEW; -- Important: always return NEW for AFTER triggers
END;$function$
;

CREATE TRIGGER tr_notifications_autoset_author_data BEFORE INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION set_notification_author_details_smarter();




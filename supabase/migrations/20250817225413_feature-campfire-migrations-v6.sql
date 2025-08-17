alter type "public"."entity_types" rename to "entity_types__old_version_to_be_dropped";

create type "public"."entity_types" as enum ('post', 'comment', 'vote', 'report', 'profile', 'system', 'view', 'video', 'campfire');

alter type "public"."notification_type" rename to "notification_type__old_version_to_be_dropped";

create type "public"."notification_type" as enum ('new_upvote', 'new_downvote', 'new_comment', 'post_saved', 'video_saved', 'video_liked', 'system_announcement', 'post_viewed', 'comment_reply', 'joined_campfire', 'leave_campfire');

alter table "public"."activity_logs" alter column entity_type type "public"."entity_types" using entity_type::text::"public"."entity_types";

alter table "public"."notifications" alter column type type "public"."notification_type" using type::text::"public"."notification_type";

drop type "public"."entity_types__old_version_to_be_dropped";

drop type "public"."notification_type__old_version_to_be_dropped";




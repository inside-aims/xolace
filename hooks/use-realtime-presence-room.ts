'use client'

// import { useCurrentUserImage } from '@/components/blocks/current-user-avatar/hooks/use-current-user-image'
// import { useCurrentUserName } from '@/components/blocks/current-user-avatar/hooks/use-current-user-name'
import { useCurrentUserName } from './use-current-user-name'
import { useCurrentUserImage } from './use-current-user-image'
import { getSupabaseBrowserClient } from '@/utils/supabase/client'
import { useUserState } from '@/lib/store/user'; // Ensure this is imported
import { useEffect, useState } from 'react'

const supabase = getSupabaseBrowserClient()

export type RealtimeUser = {
  id: string
  name: string
  image: string
}

export const useRealtimePresenceRoom = (roomName: string) => {
  const userProfile = useUserState(state => state.user); 
  const currentUserImage = useCurrentUserImage();
  const currentUserName = useCurrentUserName();

  const [users, setUsers] = useState<Record<string, RealtimeUser>>({});

  useEffect(() => {
    const room = supabase.channel(roomName);

    room
      .on('presence', { event: 'sync' }, () => {
        // Expecting name, image, and userId in the presence state
        const newState = room.presenceState<{ name: string; image: string; userId: string }>();

        const uniqueUsers: Record<string, RealtimeUser> = {};
        Object.values(newState).forEach(presences => {
          if (presences.length > 0) {
            const presenceData = presences[0]; // { name, image, userId }
            // Use userId as the key to ensure uniqueness for each user
            if (presenceData.userId && !uniqueUsers[presenceData.userId]) {
              uniqueUsers[presenceData.userId] = {
                id: presenceData.userId,
                name: presenceData.name,
                image: presenceData.image,
              };
            }
          }
        });
        setUsers(uniqueUsers);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') {
          return;
        }

        // Ensure all necessary user data is available before tracking
        if (userProfile?.id && currentUserName && currentUserImage !== '?') {
          await room.track({
            userId: userProfile.id,
            name: currentUserName,
            image: currentUserImage,
          });
        }
      });

    return () => {
      room.unsubscribe();
    };
  }, [roomName, currentUserName, currentUserImage, userProfile?.id]); // Add userProfile.id to dependency array

  return { users };
};

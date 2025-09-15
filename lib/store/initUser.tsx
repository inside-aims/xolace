'use client';

import { useEffect, useRef } from 'react';
import { useUserState } from './user';
import { Profile } from '@/types/global';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { initializePreferences } from './preferences-store';
import { getSingleSignedUrl } from '@/lib/actions/storage.actions';

// Function to fetch additional roles from the database
async function fetchAdditionalRoles(userId: string): Promise<string[]> {

    // initialize supabase client
    const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching additional roles:', error);
    return [];
  }

  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((r: any) => r.role);
}


export default function InitUser({ user }: { user: Profile | undefined }) {
  const initState = useRef(false);
  const { setUser, setRoles, setLoading, setInitialized } = useUserState();

  useEffect(() => {
    if (!initState.current) {
      async function initializeUser() {
        try {
          setLoading(true);
          
          if (user) {
            // Get additional roles from the database
            const additionalRoles = await fetchAdditionalRoles(user.id);
            // Combine them and store in Zustand
            const roles = Array.from(new Set([...additionalRoles]));

            // Check if the user is a professional and has a path-based avatar URL
            const isProfessional = roles.includes('help_professional');
            const hasPathAvatar = user.avatar_url && !user.avatar_url.startsWith('http');

            if (isProfessional && hasPathAvatar) {
              // Fetch the signed URL for the avatar
              const signedUrl = await getSingleSignedUrl(user.avatar_url);
              if (signedUrl) {
                // If successful, replace the path with the full signed URL
                user.avatar_url = signedUrl;
              }
            }

            // Set user and roles
            setUser(user);
            setRoles(roles);

            // Initialize preferences after user data is set
            await initializePreferences();
          } else {
            // No user - still set the state to indicate we're done loading
            setUser(undefined);
            setRoles([]);
          }
        } catch (error) {
          console.error('Error initializing user:', error);
          // Even on error, we should stop loading
          setUser(undefined);
          setRoles([]);
        } finally {
          setLoading(false);
          setInitialized(true);
        }
      }

      initializeUser();
    }
    initState.current = true;
  }, [user, setUser, setRoles, setLoading, setInitialized]);

  return <></>;
}


// export default function InitUser({ user }: { user: Profile | undefined }) {
//   const initState = useRef(false);

//   useEffect(() => {
//     if (!initState.current) {
      

//       async function initializeUser() {
//         if(user){
//           // Get additional roles from the database
//         const additionalRoles = await fetchAdditionalRoles(user.id);
//         // Combine them and store in Zustand
//         const roles = Array.from(new Set([...additionalRoles]));

//         // Check if the user is a professional and has a path-based avatar URL
//         const isProfessional = roles.includes('help_professional');
//         const hasPathAvatar = user.avatar_url && !user.avatar_url.startsWith('http');

//         if (isProfessional && hasPathAvatar) {
//           // Fetch the signed URL for the avatar
//           const signedUrl = await getSingleSignedUrl(user.avatar_url);
//           if (signedUrl) {
//             // If successful, replace the path with the full signed URL
//             user.avatar_url = signedUrl;
//           }
//         }

//         // Now, set the state with the fully prepared user object and roles
//         useUserState.setState({ user, roles });

//          // Initialize preferences after user data is set
//          await initializePreferences();
//         }
//       }
//       initializeUser();
//     }
//     initState.current = true;
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return <></>;
// }

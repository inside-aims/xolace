'use client';

import { useEffect, useRef } from 'react';
import { useUserState } from './user';
import { Profile } from '@/types/global';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

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

  console.log("roles ", data)
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((r: any) => r.role);
}

export default function InitUser({ user }: { user: Profile | undefined }) {
  const setRoles = useUserState((state) => state.setRoles);
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useUserState.setState({ user });

      async function initializeUser() {
        if(user){
          // Get additional roles from the database
        const additionalRoles = await fetchAdditionalRoles(user.id);
        // Combine them and store in Zustand
        const roles = Array.from(new Set([...additionalRoles]));
        console.log("full roles->",roles)
        setRoles(roles);
        }
      }
      initializeUser();
    }
    initState.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}

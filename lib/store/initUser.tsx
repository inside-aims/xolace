'use client';

import { User } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { useUserState } from './user';

export default function InitUser({ user }: { user: any | undefined }) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useUserState.setState({ user });
    }
    initState.current = true;
  }, []);

  return <></>;
}

'use client';

import { useEffect, useRef } from 'react';
import { useUserState } from './user';
import { Profile } from '@/types/global';

export default function InitUser({ user }: { user: Profile | undefined }) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useUserState.setState({ user });
    }
    initState.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}

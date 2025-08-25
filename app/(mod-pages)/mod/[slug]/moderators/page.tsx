'use client';

import React from 'react';
import { useUserState } from '@/lib/store/user';

/*
You can remove the useUserState hook and use client directive if you don't need it.
*/

const ModsPage = () => {
  const user = useUserState();
  console.log(user);
  return (
    <div>
      ModPage {user?.user?.username}
    </div>
  );
};

export default ModsPage;

'use client';

import { useState, useEffect } from 'react';
import Ping from '@/components/animated/Ping';
import { useUserState } from '@/lib/store/user';
import { updateViewsAction } from '@/app/actions';

const View = ({ id, viewsCount }: { id: string; viewsCount: number }) => {
  // get user profile data
  const user = useUserState(state => state.user);
  const [totalViews, setTotalViews] = useState(viewsCount);

  useEffect(() => {
    const handleUpdateViews = async () => {
      const result = await updateViewsAction(id, user?.id || '');
      if (result.success) {
        setTotalViews((prev) => prev + 1);
      }
    };

    const timer = setTimeout(() => {
      handleUpdateViews();
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, user?.id]);

  return (
    <div className="view-container">
      <div className="absolute -right-2 -top-2 lg:z-[50]">
        <Ping />
      </div>

      <p className="view-text lg:z-[49]">
        <span className="font-black"> 👀 : {totalViews}</span>
      </p>
    </div>
  );
};

export default View;

'use client';

import { useState, useEffect } from 'react';
import Ping from '@/components/animated/Ping';
import { useUserState } from '@/lib/store/user';
import { updateViewsAction } from '@/app/actions';
import { ScanEye } from 'lucide-react';

const View = ({ id, viewsCount, createdBy, content }: { id: string; viewsCount: number ; createdBy: string ; content: string}) => {
  // get user profile data
  const user = useUserState(state => state.user);
  const [totalViews, setTotalViews] = useState(viewsCount);

  useEffect(() => {
    const handleUpdateViews = async () => {
      const result = await updateViewsAction(id, user?.id || '', createdBy, totalViews, content);
      if (result.success) {
        setTotalViews((prev) => prev + 1);
      }
    };

    const timer = setTimeout(() => {
      handleUpdateViews();
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, user?.id,content, createdBy]);

  return (
    <div className="view-container">
      <div className="absolute -right-2 -top-2 lg:z-50">
        <Ping />
      </div>

      <p className="view-text lg:z-49 flex justify-center items-center gap-x-2">
      <ScanEye size={16} strokeWidth={3} className='text-black dark:text-white ' />{totalViews}
      </p>
    </div>
  );
};

export default View;

'use client';

import { useState, useEffect } from 'react';
import Ping from '@/components/animated/Ping';
// import { after } from 'next/server';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useUserState } from '@/lib/store/user';

const View = ({ id, viewsCount }: { id: string; viewsCount: number }) => {
  // get user profile data
  const user = useUserState(state => state.user);
  const supabase = getSupabaseBrowserClient();
  const [totalViews, setTotalViews] = useState(viewsCount);


  useEffect(() => {
    const updateViews = async () => {
        const { data} = await supabase
        .from('views')
        .insert([{ user_id: user?.id || '', post_id: id }])
        .select();

        if(data){
            setTotalViews((prev)=> prev + 1);
        }
    };

    const timer = setTimeout(()=>{
        updateViews();
    },3000)

    return () => clearTimeout(timer);
  }, [id, supabase, user?.id]);

  return (
    <div className="view-container">
      <div className="absolute -right-2 -top-2 lg:z-[9999]">
        <Ping />
      </div>

      <p className="view-text lg:z-[9998]">
        <span className="font-black"> 👀 : {totalViews}</span>
      </p>
    </div>
  );
};
export default View;

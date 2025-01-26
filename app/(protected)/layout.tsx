import React from 'react';

import ConditionalLeftSidebar from '@/components/shared/layoutUIs/ConditionalLeftSidebar';
import Bottombar from '@/components/shared/layoutUIs/Bottombar';
import Topbar from '@/components/shared/layoutUIs/Topbar';
import { createClient } from '@/utils/supabase/server';
import InitUser from '@/lib/store/initUser';
import { InfoBanner } from '@/components/extras/Info-Banner';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const supabase_user_id: string | null =
    (await supabase.auth.getUser()).data?.user?.id ?? null;
  if (!supabase_user_id) {
    console.log('error in protected layout');
    return <></>;
  }

  const { data: profileUser } = await supabase
    .from('profiles')
    .select('*')
    .eq('supabase_user', supabase_user_id)
    .single();

  return (
    <>
      <Topbar />
      <InfoBanner />
      <main className="flex flex-row">
        <ConditionalLeftSidebar />
        <section className="main-container pt-28">
          <div className="w-full px-1">{children}</div>
        </section>
      </main>
      <Bottombar />
      <InitUser user={profileUser} />
    </>
  );
}

{
  /* <Topbar />
<main className='flex flex-row'>
  <LeftSidebar />
  <section className=' main-container' >
    <div className=' w-full max-w-4xl' >
    {children}
    </div>
  </section>
  <RightSidebar />
</main>
<Bottombar /> */
}

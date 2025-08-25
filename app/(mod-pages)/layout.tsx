import React from 'react';

// import ConditionalLeftSidebar from '@/components/shared/layoutUIs/ConditionalLeftSidebar';
import Bottombar from '@/components/shared/layoutUIs/Bottombar';
// import Topbar from '@/components/shared/layoutUIs/Topbar';
import { createClient } from '@/utils/supabase/server';
import InitUser from '@/lib/store/initUser';

import { SidebarLeft } from '@/components/sidebar-left';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const supabase_user_id: string | null =
    (await supabase.auth.getClaims()).data?.claims?.sub ?? null;
  if (!supabase_user_id) {
    return <></>;
  }

  const { data: profileUser } = await supabase
    .from('profiles')
    .select('*')
    .eq('supabase_user', supabase_user_id)
    .single();


    /*
    You have to create a custom sidebar that will hold the various routes for the mod pages. That sidebar will go here.
    You can decide to use the sidebar-left component(which uses shadcn sidebar component) as a template to reference or create a custom one from scratch.
    Note that the mod sidebar has a different approach to the normal sidebar we have(view reddit mod sidebar for reference).

    I have already added the site header and the bottom bar.
    */

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider
        className="flex flex-col"
        style={{ '--header-height': '60px' } as React.CSSProperties}
      >
        <SiteHeader />
        {children}
        <Bottombar />
        <InitUser user={profileUser} />
      </SidebarProvider>
    </div>
  );
}

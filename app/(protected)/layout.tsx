import React from 'react';

// import ConditionalLeftSidebar from '@/components/shared/layoutUIs/ConditionalLeftSidebar';
import Bottombar from '@/components/shared/layoutUIs/Bottombar';
// import Topbar from '@/components/shared/layoutUIs/Topbar';
import { createClient } from '@/utils/supabase/server';
import InitUser from '@/lib/store/initUser';
// import { InfoBanner } from '@/components/extras/Info-Banner';

import { SidebarLeft } from "@/components/sidebar-left"
import { SidebarRight } from "@/components/sidebar-right"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const supabase_user_id: string | null =
    (await supabase.auth.getUser()).data?.user?.id ?? null;
  if (!supabase_user_id) {
    return <></>;
  }

  const { data: profileUser } = await supabase
    .from('profiles')
    .select('*')
    .eq('supabase_user', supabase_user_id)
    .single();

  return (
    <SidebarProvider>
    <SidebarLeft />
    <SidebarInset>
      <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                  Project Management & Task Tracking
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <section className="main-container">
        {children}
      </section>
      <Bottombar />
    </SidebarInset>
    <SidebarRight />
    <InitUser user={profileUser} />
  </SidebarProvider>
  );
}


{
/*
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
*/

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

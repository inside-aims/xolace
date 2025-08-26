import React from 'react';

import Bottombar from '@/components/shared/layoutUIs/Bottombar';
import { createClient } from '@/utils/supabase/server';
import InitUser from '@/lib/store/initUser';

import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import {ModsSidebarLeft} from "@/components/mods/layout/mod-siderbar-left";
import type {Metadata} from "next";


export const metadata: Metadata = {
  title: {
    template: '%s • Mod Tools | Xolace',
    default: 'Mod Tools | Xolace',
  },
  description: "Discover different stories, experiences from real and unique individuals as well as the community"
};


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
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider
          className="flex flex-col"
          style={{'--header-height': '60px'} as React.CSSProperties}
        >
          <SiteHeader/>
          <div className="flex flex-1">
            <ModsSidebarLeft collapsible='icon'/>
            <SidebarInset>
              <section className="p-4 md:p-8">
                {children}
              </section>
              <Bottombar/>
            </SidebarInset>
            {/* <SidebarRight /> */}
          </div>
          <InitUser user={profileUser}/>
        </SidebarProvider>
      </div>
    </div>
  );
}

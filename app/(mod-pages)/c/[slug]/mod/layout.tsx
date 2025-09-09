import React from 'react';
import { redirect } from 'next/navigation';
import Bottombar from '@/components/shared/layoutUIs/Bottombar';
import { createClient } from '@/utils/supabase/server';
import InitUser from '@/lib/store/initUser';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { ModsSidebarLeft } from "@/components/mods/layout/mod-siderbar-left";
import { checkModeratorAccess } from '@/utils/campfires/permissions';
import { ModAccessDenied } from '@/components/campfires/mod-access-guard';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s • Mod Tools | Xolace',
    default: 'Mod Tools | Xolace',
  },
  description: "Mod tools for your campfire"
};

interface ModLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function ModLayout({ children, params }: ModLayoutProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Check authentication
  const supabase_user_id: string | null =
    (await supabase.auth.getClaims()).data?.claims?.sub ?? null;
  
  if (!supabase_user_id) {
    redirect('/sign-in');
  }

  // Get user profile
  const { data: profileUser } = await supabase
    .from('profiles')
    .select('*')
    .eq('supabase_user', supabase_user_id)
    .single();

  if (!profileUser) {
    redirect('/sign-in');
  }

  // Check moderator access
  const accessCheck = await checkModeratorAccess(slug, profileUser.id);

  // If no access, show access denied page
  if (accessCheck.hasAccess) {
    return (
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider
          className="flex flex-col"
          style={{ '--header-height': '60px' } as React.CSSProperties}
        >
          <SiteHeader />
          <div className="flex flex-1">
            <SidebarInset>
              <ModAccessDenied error={accessCheck.error} slug={slug} />
              <Bottombar />
            </SidebarInset>
          </div>
          <InitUser user={profileUser} />
        </SidebarProvider>
      </div>
    );
  }

  // User has access, render mod layout
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider
        className="flex flex-col"
        style={{ '--header-height': '60px' } as React.CSSProperties}
      >
        <SiteHeader />
        <div className="flex flex-1">
          <ModsSidebarLeft collapsible='icon' />
          <SidebarInset>
            <section className="p-4 md:p-8">
              {children}
            </section>
            <Bottombar />
          </SidebarInset>
        </div>
        <InitUser user={profileUser} />
      </SidebarProvider>
    </div>
  );
}
'use client';

import * as React from 'react';
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  Cog,
  Search,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {ModsNavMain} from "@/components/mods/layout/mods-main-nav";

export function ModsSidebarLeft({...props}: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, open } = useSidebar();

  return (
    <>
      <Sidebar
        className="top-(--header-height) h-[calc(100svh-var(--header-height))]!  border-r-0"
        {...props}
      >
        <SidebarHeader className="relative px-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="bg-bg dark:bg-bg-dark absolute top-0 -right-5 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border-r-[1px] border-b-[0px] border-gray-300 hover:border-gray-600 md:flex dark:border-gray-600/40 dark:hover:border-gray-200"
                onClick={toggleSidebar}
              >
                {open ? (
                  <ChevronLeft className="size-5" />
                ) : (
                  <ChevronRight className="size-5" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              align="center"
              className="bg-black text-white dark:bg-white dark:text-black"
            >
              <p>{open ? 'Collapse Navigation' : 'Expand Navigation'}</p>
            </TooltipContent>
          </Tooltip>
        </SidebarHeader>
        <SidebarContent className={""}>
          <ModsNavMain/>
        </SidebarContent>
      </Sidebar>
    </>
  );
}

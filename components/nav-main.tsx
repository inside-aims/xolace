"use client"

import { usePathname } from "next/navigation"
import Link from "next/link";
//import { type LucideIcon } from "lucide-react"

import { sidebarLinks } from "@/constants"
import { useSidebar } from "@/components/ui/sidebar";
import LinkLoadingIndicator from "./shared/loaders/LinkLoadingIndicator";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


interface SidebarLinkInterface{
  icon: React.JSX.Element,
  route: string;
  label: string;
}

export function NavMain() {
  const pathName = usePathname();
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenu className="gap-1 md:gap-3 pt-5">
      {sidebarLinks.map((item : SidebarLinkInterface) => {
        const isActive =
        (pathName.includes(item.route) && item.route.length > 1) ||
        pathName == item.route;

        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild isActive={isActive} className={`${isActive && 'bg-lavender-500!'} hover:bg-lavender-700/40 py-5`} onClick={()=> setOpenMobile(false)}>
              <Link href={item.route}
                key={item.label}>
                {item.icon}
                <span className="text-sidebar-label mr-2">{item.label}</span> <LinkLoadingIndicator/>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

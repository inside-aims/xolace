"use client"

import { usePathname } from "next/navigation"
import Link from "next/link";
//import { type LucideIcon } from "lucide-react"

import { sidebarLinks } from "@/constants"
import { useSidebar } from "@/components/ui/sidebar";

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
  const { toggleSidebar, setOpenMobile } = useSidebar();
  return (
    <SidebarMenu className="gap-6">
      {sidebarLinks.map((item : SidebarLinkInterface) => {
        const isActive =
        (pathName.includes(item.route) && item.route.length > 1) ||
        pathName == item.route;

        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild isActive={isActive} className={`${isActive && '!bg-primary-500'} hover:bg-primary-500`} onClick={()=> setOpenMobile(false)}>
              <Link href={item.route}
                key={item.label}>
                {item.icon}
                <span className="text-lg">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

"use client"

import { usePathname } from "next/navigation"
import Link from "next/link";
//import { type LucideIcon } from "lucide-react"

import { sidebarLinks } from "@/constants"

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
  return (
    <SidebarMenu className="gap-6">
      {sidebarLinks.map((item : SidebarLinkInterface) => {
        const isActive =
        (pathName.includes(item.route) && item.route.length > 1) ||
        pathName == item.route;

        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild isActive={isActive} className={`${isActive && '!bg-primary-500'} hover:bg-primary-500`}>
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

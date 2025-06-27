"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  // AudioWaveform,
  Blocks,
  HandHelping,
  // Calendar,
  // Command,
  // Home,
  // Inbox,
  // MessageCircleQuestion,
  // Search,
  // Settings2,
  // Sparkles,
  // Trash2,
} from "lucide-react"
import LiquidGlassButton from "./shared/LiquidGlassButton"

//import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
// import { NavWorkspaces } from "@/components/nav-workspaces"
//import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
//import UserInfo from "./user-info"

import { useUserState } from "@/lib/store/user"
import { NavMiddle } from "./nav-middle"
import { Separator } from "./ui/separator"

const data = {
  navSecondary: [
    {
      title: "Activity",
      url: "/activities",
      icon: Blocks,
    },
        // {
        //   title: "Settings",
        //   url: "#",
        //   icon: Settings2,
        // },
        // {
        //   title: "Help",
        //   url: "#",
        //   icon: MessageCircleQuestion,
        // },
      ],
      navMiddle: [
        {
          title: "Health Space",
          url: "#",
          icon: HandHelping,
          isActive: true,
          items: [
            {
              title: "Health Tips",
              url: "/health-tips",
            },
            {
              title: "Reflections",
              url: "/reflections",
            },
          ],
        },]
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

   // get user profile data
   const user = useUserState(state => state.user);
   const { roles } = useUserState()
  return (
    <Sidebar  className="top-(--header-height) h-[calc(100svh-var(--header-height))]! border-r-0" {...props}>
      <SidebarHeader>
        {/* <UserInfo user={user}/> */}
        <NavMain/>
      </SidebarHeader>
      <SidebarContent>
        {/*Health tips to display on mobile drawer*/}
        {/* <div className={"flex  mx-4 mt-8 md:hidden"}>
          <HealthTips/>
        </div> */}
        <Separator className="w-[90%] mt-3 mx-auto"/>
        <NavMiddle items={data.navMiddle}/>
        {/* <NavFavorites favorites={data.favorites} /> */}
        {/* <NavWorkspaces workspaces={data.workspaces} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto"/>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4">
          <LiquidGlassButton size="sm" onClick={()=> router.push('/updates')}/>
        </div>
        <NavUser user={user} roles={roles} />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}

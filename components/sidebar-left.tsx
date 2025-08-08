"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  // AudioWaveform,
 Flame,
  Plus,
  Blocks,
  HandHelping,
  ChevronLeft,
  ChevronRight,
  TvMinimalPlay,
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
  useSidebar
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
//import UserInfo from "./user-info"

import { useUserState } from "@/lib/store/user"
import { NavMiddle } from "./nav-middle"
import { Separator } from "./ui/separator"
import {Button} from "@/components/ui/button";
import CreateCampfireModal from "@/components/campfires/campfire-creation-modal";

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const { toggleSidebar , open} = useSidebar();

   // get user profile data
   const user = useUserState(state => state.user);
   const { roles } = useUserState()

  const data = {
    navSecondary: [
      {
        key: "activity",
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
    campfireNav: [
      {
        key: "campfire",
        title: "Campfire",
        url: "#",
        icon: Flame,
        isActive: true,
        items: [
          {
            key: "createCampfire",
            title: "Create Campfire",
            onClick: () => setIsModalOpen(true),
            icon: Plus
          },
        ],
      },],
    navMiddle: [
      {
        key: "healthSpace",
        title: "Health Space",
        url: "#",
        icon: HandHelping,
        isActive: true,
        items: [
          {
            key: "healthTips",
            title: "Health Tips",
            url: "/health-tips",
          },
          {
            key: "glimpse",
            title: "Glimpse",
            url: "/glimpse",
            icon: TvMinimalPlay
          },
        ],
      },]
  }


  return (
<>
    <Sidebar  className="top-(--header-height) h-[calc(100svh-var(--header-height))]! border-r-0" {...props}>
      <SidebarHeader className=" relative">
        {/* <UserInfo user={user}/> */}
        <div className="absolute top-0 -right-5 w-10 h-10 rounded-full bg-bg dark:bg-bg-dark border-gray-300 dark:border-gray-600/40 border-r-[1px] border-b-[0px] hidden md:flex items-center justify-center cursor-pointer" onClick={toggleSidebar}>
          {open ? <ChevronLeft className=" size-5"/> : <ChevronRight className=" size-5"/>}
        </div>
        <NavMain/>
      </SidebarHeader>
      <SidebarContent>
        {/*Health tips to display on mobile drawer*/}
        {/* <div className={"flex  mx-4 mt-8 md:hidden"}>
          <HealthTips/>
        </div> */}
        <Separator className="w-[90%] mt-1 mx-auto"/>
          <NavMiddle items={data.campfireNav}/>

        <Separator className="w-[90%] mx-auto"/>
        <NavMiddle items={data.navMiddle}/>
        {/* <NavFavorites favorites={data.favorites} /> */}
        {/* <NavWorkspaces workspaces={data.workspaces} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto"/>
      </SidebarContent>
      <SidebarFooter>
        <div className={`px-4 ${!open && 'hidden' }`}>
          <LiquidGlassButton size="sm" onClick={()=> router.push('/updates')}/>
        </div>
        <NavUser user={user} roles={roles} />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>

     <CreateCampfireModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
</>
  )
}

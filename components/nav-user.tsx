"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import {
  ChevronsUpDown,
  LogOut,
  Settings, SettingsIcon, UserPen,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Profile } from "@/types/global"
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import SignoutAlert from "./shared/SignoutAlert"
import profBadge from "../public/assets/images/user-role-badges/consellors-badge.webp"

interface NavUserFeaturesProps {
  key: string,
  label: string,
  route: string,
  icon: React.ReactNode,
}
const navUserFeatures: NavUserFeaturesProps[] = [
  {
    key: "profile",
    label: "Profile",
    route: "/profile",
    icon: <UserPen />,
  },
  {
    key: "settings",
    label: "Settings",
    route: "/settings",
    icon: <SettingsIcon />,
  }
]

export function NavUser({
  user,
  roles,
}: {
  user?: Profile
  roles?: string[]
}) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  // states
  const { isMobile , setOpenMobile } = useSidebar()
  const [isOpen, setIsOpen] = useState(false);
  const [timestamp, setTimestamp] = useState("")

  // signout func
  const handleSignOut = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (user?.is_anonymous) {
      setIsOpen(true);
      return;
    }

    localStorage.removeItem('welcomePopupDismissed');
    supabase.auth.signOut();
  };

    // convert created_at
    useEffect(() => {
      if (user) {
        const date = new Date(user.created_at);
        setTimestamp(`since ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`);
      } else {
        setTimestamp("Long ago")
      }
      
    }, [user]);

   // Subscribe to sign out event
   useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push(`/sign-in`);
      }
    });

    // end subscription event
    return () => {
      subscription.unsubscribe();
    };
  }, [router , supabase.auth]);

  const handleUserNavRouting = (path: string) =>{
    setOpenMobile(false)
    router.push(path);
  }


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar_url ?? undefined} alt={user?.username} />
                <AvatarFallback className="rounded-lg">{user?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold flex items-center gap-[2px]">{user?.username} {roles?.includes("help_professional") && <Image src={profBadge} alt="professional badge" width={20} height={20} />}</span>
                <span className="truncate text-xs">{timestamp}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg dark:bg-bg-dark"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            {/* <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar_url ?? undefined} alt={user?.username} />
                  <AvatarFallback className="rounded-lg">{user?.username?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.username}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator /> */}
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              {navUserFeatures.map(feature => (
               <div key={feature.key}>
                 <DropdownMenuItem
                   onClick={() => handleUserNavRouting(feature.route)}
                 >
                   {feature.icon} {feature.label}
                 </DropdownMenuItem>
                 <DropdownMenuSeparator />
               </div>
              ))}
            </DropdownMenuGroup>
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem className=" cursor-pointer" onClick={e => handleSignOut(e)}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <SignoutAlert isOpen={isOpen} setIsOpen={setIsOpen} />
    </SidebarMenu>
  )
}

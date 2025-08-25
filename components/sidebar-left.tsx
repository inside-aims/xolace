'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Flame,
  Plus,
  Blocks,
  HandHelping,
  ChevronLeft,
  ChevronRight,
  TvMinimalPlay,
  HeartPulse,
  Cog,
  Search,
} from 'lucide-react';
import LiquidGlassButton from './shared/LiquidGlassButton';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavUser } from './nav-user';

import { useUserState } from '@/lib/store/user';
import { NavMiddle } from './nav-middle';
import { Separator } from './ui/separator';
import CreateCampfireModal from '@/components/campfires/campfire-creation-modal';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { toggleSidebar, open } = useSidebar();

  // get user profile data
  const user = useUserState(state => state.user);
  const { roles } = useUserState();

  const handleOpenCreateCampfireModal = () => {
    if (!user) {
      toast.error('Please sign in to create a campfire, or reload the page.');
      return;
    }
    if (user.is_anonymous) {
      toast.error(
        'Anonymous users cannot create campfires. Please use a real account.',
        {
          duration: 3000,
        },
      );
      return;
    }
    setIsModalOpen(true);
  };

  const data = {
    navSecondary: [
      {
        key: 'activity',
        title: 'Activity',
        url: '/activities',
        icon: Blocks,
      },
    ],
    campfireNav: [
      {
        key: 'campfire',
        title: 'Campfire',
        url: '#',
        icon: Flame,
        isActive: true,
        isBeta: true,
        items: [
          {
            key: 'createCampfire',
            title: 'Create Campfire',
            onClick: handleOpenCreateCampfireModal,
            icon: Plus,
            isNew: false,
            isBeta: false,
          },
          {
            key: 'manageCampfire',
            title: 'Manage Campfires',
            url: `/user/x/campfires`,
            icon: Cog,
            isNew: false,
            isBeta: false,
          },
          {
            key: 'discoverCampfires',
            title: 'Discover Campfires',
            url: '/campfires/discover',
            icon: Search,
            isNew: false,
            isBeta: false,
          },
        ],
      },
    ],
    navMiddle: [
      {
        key: 'healthSpace',
        title: 'Health Space',
        url: '#',
        icon: HandHelping,
        isActive: true,
        items: [
          {
            key: 'healthTips',
            title: 'Health Tips',
            url: '/health-tips',
            icon: HeartPulse,
            isNew: true,
            isBeta: false,
          },
          {
            key: 'glimpse',
            title: 'Glimpse',
            url: '/glimpse',
            icon: TvMinimalPlay,
            isNew: true,
            isBeta: false,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Sidebar
        className="top-(--header-height) h-[calc(100svh-var(--header-height))]! border-r-0"
        {...props}
      >
        <SidebarHeader className="relative">
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
          <NavMain />
        </SidebarHeader>
        <SidebarContent>
          <Separator className="mx-auto mt-1 w-[90%]" />
          <NavMiddle items={data.campfireNav} />

          <Separator className="mx-auto w-[90%]" />
          <NavMiddle items={data.navMiddle} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <div className={`px-4 ${!open && 'hidden'}`}>
            <LiquidGlassButton
              size="sm"
              onClick={() => router.push('/updates')}
            />
          </div>
          <NavUser user={user} roles={roles} />
        </SidebarFooter>
      </Sidebar>

      <CreateCampfireModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}

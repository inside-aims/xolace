'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
//import { type LucideIcon } from "lucide-react"

import { sidebarLinks } from '@/constants';
import { useSidebar } from '@/components/ui/sidebar';
import LinkLoadingIndicator from './shared/loaders/LinkLoadingIndicator';
import { NewBadge } from './shared/NewBadge';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then(mod => mod.DotLottieReact),
  {
    ssr: false,
    loading: () => (
      <p className="h-3 w-3 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></p>
    ),
  },
);

interface SidebarLinkInterface {
  icon: React.JSX.Element;
  route: string;
  label: string;
  new?: boolean;
  lottieLink?: string;
  useLottieIcon?: boolean;
}

export function NavMain() {
  const pathName = usePathname();
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenu className="gap-1 pt-5 md:gap-3">
      {sidebarLinks.map((item: SidebarLinkInterface) => {
        const isActive =
          (pathName.includes(item.route) && item.route.length > 1) ||
          pathName == item.route;

        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={`${isActive && 'bg-lavender-500!'} hover:bg-lavender-700/40 py-5`}
              onClick={() => setOpenMobile(false)}
            >
              <Link href={item.route} key={item.label} className="relative">
                {item.useLottieIcon ? (
                  <DotLottieReact
                    src={item.lottieLink}
                    loop
                    autoplay
                    className="absolute -bottom-[1px] left-0 size-14"
                  />
                ) : (
                  item.icon
                )}
                <span
                  className={`text-sidebar-label mr-2 ${item.useLottieIcon ? 'ml-7' : ''}`}
                >
                  {item.label}
                </span>{' '}
                {item.new && <NewBadge variant="glow" size="sm" />}{' '}
                <LinkLoadingIndicator />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

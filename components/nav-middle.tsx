'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { NewBadge } from './shared/NewBadge';

export function NavMiddle({
  items,
}: {
  items: {
    key: string;
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      key: string;
      title: string | React.ReactNode;
      url?: string;
      icon?: LucideIcon;
      onClick?: () => void;
    }[];
  }[];
}) {
  const pathName = usePathname();
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map(item => (
          <Collapsible
            key={item.key}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="py-5 tracking-widest uppercase focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                >
                  {item.icon && <item.icon />}
                  <span className="text-muted-foreground text-xs leading-4">
                    {item.title}
                  </span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map(subItem => {

                    let isActive = false;
                    if(subItem.url){
                      isActive =
                        (pathName.includes(subItem.url) &&
                          subItem.url.length > 1) ||
                        pathName == subItem.url;
                    }

                    return (
                      <SidebarMenuSubItem key={subItem.key}>
                        <SidebarMenuSubButton
                          asChild
                          className="py-5 relative"
                          isActive={isActive}
                          onClick={subItem.onClick ? subItem.onClick : () => setOpenMobile(false)}
                        >
                          {subItem.url ?
                          <Link href={subItem.url} className='flex justify-start items-center'>
                            <span className="text-sidebar-label flex items-center gap-2">
                              {subItem.icon && <subItem.icon size={16} />}
                              {subItem.title}
                            </span>
                            {/*<NewBadge size="sm" />*/}
                          </Link>
                        : 
                        <span className="text-sidebar-label cursor-pointer flex items-center">
                          {subItem.icon && <subItem.icon size={16} />}
                          {subItem.title}
                        </span>
                        }
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

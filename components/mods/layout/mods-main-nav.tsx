'use client';

import {usePathname, useRouter, useParams} from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button"

import { useSidebar } from '@/components/ui/sidebar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {getModsSidebarSections} from "@/components/mods/layout/constants";
import {ArrowLeft, Loader2} from "lucide-react";
import React from "react";
import { getModeratedCampfires } from "@/queries/campfires/moderations/getModeratedCampfires";

export function ModsNavMain() {
  // get the slug params 
  const params = useParams<{ slug: string }>()
  const sidebarSections = getModsSidebarSections(params.slug);

  // const [searchTerm, setSearchTerm] = React.useState('');

  const router = useRouter();
  const pathName = usePathname();
  const { setOpenMobile } = useSidebar();

  const { data: moderatedCampfires , isPending: moderatedCampfiresPending , isError } = getModeratedCampfires();

  // Handle campfire selection change
  const handleCampfireChange = (selectedSlug: string) => {
    if (!pathName || !params.slug) return;
    
    const newPath = pathName.replace(params.slug, selectedSlug);
    router.push(newPath);
  };

  return (
    <SidebarMenu className="gap-6 pt-0 ">
      <Button
        variant={"ghost"}
        size={"sm"}
        className={"flex gap-1 items-center justify-start w-full text-neutral-500"}
        onClick={() => router.push(`/x/${params.slug}`)}
      >
        <ArrowLeft size={16}/> <span>Exit mod tools</span>
      </Button>

              <div className={"flex flex-col gap-2 w-full items-center justify-start px-2"}>
        <div className={"flex items-center justify-start w-full"}>
          <Select value={params.slug} onValueChange={handleCampfireChange} disabled={moderatedCampfiresPending || isError}>
            <SelectTrigger
              className="w-[160px] rounded-full h-8 border-none hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm flex items-center">
              <SelectValue placeholder={
                moderatedCampfiresPending 
                  ? (<div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div> )
                  : isError 
                  ? "Error loading"
                  : "Select campfire"
              }/>
            </SelectTrigger>
            <SelectContent>
              {moderatedCampfiresPending ? (
                <SelectItem value="loading" disabled>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                </SelectItem>
              ) : isError ? (
                <SelectItem value="error" disabled>
                  <span className="text-red-500">Failed to load campfires</span>
                </SelectItem>
              ) : moderatedCampfires?.length === 0 ? (
                <SelectItem value="empty" disabled>
                  <span className="text-muted-foreground">No campfires found</span>
                </SelectItem>
              ) : moderatedCampfires && (
                moderatedCampfires.map((c) => (
                  <SelectItem key={c.id} value={c.slug}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 rounded-full">
                        <AvatarImage src={c.icon_url || ''} alt={c.name}/>
                        <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className=' truncate'>{c.name}</span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        {/* <div className="relative w-full rounded-full">
          <span className="absolute inset-y-0 start-0 flex items-center ps-2">
            <Search className="w-4 h-4 text-muted-foreground"/>
          </span>
          <Input
            type="text"
            name="searchInput"
            placeholder="Search tools"
            className="rounded-full ps-8 h-8 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
      </div>

      <div className="w-full flex flex-col gap-6">
        {sidebarSections.map((section) => (
          <div key={section.title} className="w-full flex flex-col gap-1">
            <span className="px-2 text-xs font-semibold">
              {section.title}
            </span>
            {section.items.map((item) => {
              const isActive =
                (pathName.includes(item.route) && item.route.length > 1) ||
                pathName === item.route;

              return (
                <SidebarMenuItem key={item.label} className="w-full flex">
                  <SidebarMenuButton
                    asChild
                    className={`${isActive && 'border-s-4 border-lavender-600 rounded-none'} hover:bg-neutral-100 dark:hover:bg-neutral-800 py-4`}
                    onClick={() => setOpenMobile(false)}
                    tooltip={item.label}
                  >
                    <Link href={item.route} className="relative flex items-center">
                      <item.icon className="size-5" strokeWidth={1.75}/>
                      <span className="text-sidebar-label ml-2">{item.label}</span>
                      {item.new && (
                        <span className="ml-2 text-[10px] px-1 py-0.5 rounded bg-red-600 text-white">
                          NEW
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </div>
        ))}
      </div>
    </SidebarMenu>
  );
}
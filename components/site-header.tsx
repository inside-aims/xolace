'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
//import { Separator } from "@/components/ui/separator"
import { useSidebar } from '@/components/ui/sidebar';
import ThemeSwitch from './ui/ThemeSwitch';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useUserState } from '@/lib/store/user';
// import { RealtimeAvatarStack } from './realtime-avatar-stack';
import mascot from '../public/assets/images/x-logo-full.webp';
import { Menu, PlusIcon, Bell } from 'lucide-react';
import NotificationPanel from '@/components/notifications/notification-panel';
import { Badge } from './ui/badge';
import { useNotificationCount } from '@/hooks/notifications/useNotificationCount';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import XolaceText from './icons/XolaceText';

export function SiteHeader() {
  // get user profile data
  const { roles, user } = useUserState();
  const isProfessional = roles.includes('help_professional');
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const bellButtonRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = getSupabaseBrowserClient();
  const { toggleSidebar } = useSidebar();
  const queryClient = useQueryClient();

  // ✅ Use the clean, abstracted hook to get the count for the logged-in user.
  const { count } = useNotificationCount(user?.id);

  // The real-time subscription remains the same.
  useEffect(() => {
    // Only subscribe if a user is logged in.
    if (!user) return;

    const channel = supabase
      .channel(`realtime-notifications-${user.id}`) // Channel can be user-specific
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_user_id=eq.${user.id}`,
        },
        () => {
          // When a change occurs, invalidate the queries to refetch fresh data.
          // Invalidating the root 'notifications' key will refetch both the count and the list.
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, user, supabase]);

  // Subscribe to sign out event
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_OUT') {
        router.push(`/sign-in`);
      }
    });

    // end subscription event
    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  //Close notification panel when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        notificationRef.current &&
        bellButtonRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        !bellButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  //Close panel when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className="bg-bg dark:bg-bg-dark sticky top-0 z-50 flex w-full items-center border-b opacity-[0.96] dark:border-gray-700/90 dark:opacity-100"
        id="navbar"
      >
        <div className="relative flex h-(--header-height) w-full items-center justify-between ps-3 pe-3 sm:pe-10">
          <div className="flex items-center gap-1">
            <Button
              className="h-8 w-8 block md:hidden"
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
              id="sidebar-btn"
            >
              <Menu strokeWidth={1.5} />
            </Button>

            {/* Logo */}
            <div>
              <Link href="/feed" className="flex items-center">
                <Image
                  src={mascot}
                  alt="logo"
                  width={50}
                  height={50}
                  priority={true}
                  loading="eager"
                />
                <XolaceText />
              </Link>
              

              {/* <div className="md:hidden">
            <ProgressBetaBadge progress={30} />
          </div> */}
            </div>
          </div>


          {/* Theme switcher */}
          <div
            className={`flex items-center max-sm:justify-center ${isProfessional ? 'gap-x-2 md:gap-x-5' : 'gap-x-5'}`}
          >
            {/* link to navigate create-health-tips */}
            {/* design like a button */}
            {roles.includes('help_professional') && (
              <Link
                href="/create-health-tips"
                className="hover:bg-lavender-400 flex items-center gap-x-1 rounded-full px-2 py-2 transition-colors hover:text-white"
              >
                <PlusIcon height="22" className="size-7 max-sm:size-8" />{' '}
                <span className="hidden text-sm md:block">Create</span>
              </Link>
            )}
            <div className="hidden items-center md:flex">
              <ThemeSwitch />
            </div>
            
            {/*Notification entry section*/}
            <div className="relative">
              <button
                type="button"
                className={'flex cursor-pointer items-center'}
                onClick={() => setIsOpen(!isOpen)}
                ref={bellButtonRef}
              >
                <Bell size={22} />
              </button>
              {count
                ? count > 0 && (
                    <Badge
                      className="absolute -top-2 -right-1 h-4 min-w-4 rounded-full px-1 font-mono tabular-nums"
                      variant="destructive"
                    >
                      {count > 9 ? '9+' : count}
                    </Badge>
                  )
                : null}
            </div>

            {/* <div id="online-users" className={'flex items-center'}>
              <RealtimeAvatarStack roomName="break_room" />
            </div> */}
          </div>
          {isOpen && (
            <AnimatePresence>
              <motion.div
                className={
                  'bg-bg fixed top-[var(--header-height)] right-0 z-[9999] flex h-auto max-h-[calc(90vh-var(--header-height)-70px)] w-[calc(100%-1rem)] max-w-[80%] flex-col rounded-lg border shadow-lg md:max-h-[calc(90vh-40px)] md:w-[400px] dark:bg-[#1b1a1a]'
                }
                initial={{ x: 300, opacity: 0, scale: 0.98 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 300, opacity: 0, scale: 0.98 }}
                transition={{
                  x: isOpen
                    ? { duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }
                    : { duration: 0.9, ease: [0.25, 0.8, 0.25, 1] },
                  opacity: isOpen
                    ? { duration: 0.2, ease: 'easeOut' }
                    : { duration: 0.5, ease: 'easeIn' },
                  scale: isOpen
                    ? { duration: 0.2, ease: 'easeOut' }
                    : { duration: 0.5, ease: 'easeIn' },
                }}
                ref={notificationRef}
              >
                <NotificationPanel />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </header>

      {/* <SignoutAlert isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { Button } from '@/components/ui/button';
//import { Separator } from "@/components/ui/separator"
import { useSidebar } from '@/components/ui/sidebar';
import ThemeSwitch from './ui/ThemeSwitch';
import { ProgressBetaBadge } from './shared/ProgressBetaBadge';
import { LogoutIcon } from './animated/Icons/LogoutIcon';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import SignoutAlert from './shared/SignoutAlert';
import { useUserState } from '@/lib/store/user';

export function SiteHeader() {
  // get user profile data
  const user = useUserState(state => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const { toggleSidebar } = useSidebar();

  //   signout function
  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (user?.is_anonymous) {
      setIsOpen(true);
      return;
    }

    localStorage.removeItem('welcomePopupDismissed');
    supabase.auth.signOut();
  };

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

  return (
    <>
      <header className="sticky top-0 z-50 flex w-full items-center border-b bg-white opacity-[0.96] dark:border-gray-700/90 dark:bg-black dark:opacity-100">
        <div className="flex h-[--header-height] w-full items-center justify-between gap-2 px-4">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user?.avatar_url ?? undefined} alt={user?.username ?? "avatar"} />
              <AvatarFallback className=' bg-indigo-500'>{user?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-x-4">
            <Link href="/feed" className="flex items-center gap-4">
              <Image
                src="/assets/images/anonymous-messenger.png"
                alt="logo"
                width={40}
                height={32}
                className="hidden dark:block"
                priority={true}
                loading="eager"
              />

              <Image
                src="/assets/images/anonymous-messenger_light.png"
                alt="logo"
                width={40}
                height={32}
                className="block dark:hidden"
                 priority={true}
                loading="eager"
              />
            </Link>

            {/* <div className="md:hidden">
            <ProgressBetaBadge progress={30} />
          </div> */}
          </div>

          <div className="block md:hidden" id="sign-out">
            <Button
              variant={'ghost'}
              className="shad-button_ghost"
              onClick={e => handleSignOut(e)}
              aria-label="Sign out"
            >
              <LogoutIcon height="23" />
            </Button>
          </div>

          {/* Theme switcher */}
          <div className="hidden gap-x-5 md:flex">
            <ThemeSwitch />
            <div>
              <ProgressBetaBadge progress={30} />
            </div>
          </div>
        </div>
      </header>

      <SignoutAlert isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

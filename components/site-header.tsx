'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { Button } from '@/components/ui/button';
//import { Separator } from "@/components/ui/separator"
import { useSidebar } from '@/components/ui/sidebar';
import ThemeSwitch from './ui/ThemeSwitch';
//import { ProgressBetaBadge } from './shared/ProgressBetaBadge';
//import { LogoutIcon } from './animated/Icons/LogoutIcon';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
//import SignoutAlert from './shared/SignoutAlert';
import { useUserState } from '@/lib/store/user';
import { RealtimeAvatarStack } from './realtime-avatar-stack';
import mascot from '../public/assets/images/x-logo-full.webp';
import { PlusIcon } from 'lucide-react';

export function SiteHeader() {
  // get user profile data
  const user = useUserState(state => state.user);
  const { roles } = useUserState();
  const isProfessional = roles.includes('help_professional');
  // const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const { toggleSidebar } = useSidebar();

  //   signout function
  // const handleSignOut = async (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  // ) => {
  //   e.preventDefault();

  //   if (user?.is_anonymous) {
  //     setIsOpen(true);
  //     return;
  //   }

  //   localStorage.removeItem('welcomePopupDismissed');
  //   supabase.auth.signOut();
  // };

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

  return (
    <>
      <header
        className="bg-bg dark:bg-bg-dark sticky top-0 z-50 flex w-full items-center border-b opacity-[0.96] dark:border-gray-700/90 dark:opacity-100"
        id="navbar"
      >
        <div className="relative flex h-(--header-height) w-full items-center justify-between ps-3 pe-3 sm:pe-10">
          <div className="flex items-center gap-1">
            <Button
              className="h-8 w-8"
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
              id="sidebar-btn"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.avatar_url ?? undefined}
                  alt={user?.username ?? 'avatar'}
                />
                <AvatarFallback className="bg-indigo-500">
                  {user?.username?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>

            {/* Logo */}
            <div>
              <Link href="/feed" className="flex items-center gap-4">
                <Image
                  src={mascot}
                  alt="logo"
                  width={50}
                  height={50}
                  priority={true}
                  loading="eager"
                />
              </Link>

              {/* <div className="md:hidden">
            <ProgressBetaBadge progress={30} />
          </div> */}
            </div>
          </div>

          {/* <div className="block md:hidden" id="sign-out">
            <Button
              variant={'ghost'}
              className="shad-button_ghost"
              onClick={e => handleSignOut(e)}
              aria-label="Sign out"
            >
              <LogoutIcon height="23" />
            </Button>
          </div> */}

          {/* Theme switcher */}
          <div
            className={`flex items-center max-sm:justify-center ${isProfessional ? 'gap-x-2 md:w-50 md:gap-x-5' : 'gap-x-5 md:w-30'}`}
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
            <div className="hidden md:block">
              <ThemeSwitch />
            </div>
            <div id="online-users">
              {/* <ProgressBetaBadge progress={30} /> */}
              <RealtimeAvatarStack roomName="break_room" />
            </div>
          </div>
        </div>
      </header>

      {/* <SignoutAlert isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </>
  );
}

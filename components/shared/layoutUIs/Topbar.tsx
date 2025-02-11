'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import ThemeSwitch from '../../ui/ThemeSwitch';
import MobileNav from '../MobileNav';
import { Button } from '../../ui/button';
import { LogoutIcon } from '../../animated/Icons/LogoutIcon';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import SignoutAlert from '../SignoutAlert';
import { useUserState } from '@/lib/store/user';
import { ProgressBetaBadge } from '../ProgressBetaBadge';

function Topbar() {
  // get user profile data
  const user = useUserState(state => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

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
      <nav className="topbar">
        <div className="flex items-center gap-x-4">
          <Link href="/feed" className="flex items-center gap-4">
            <Image
              src="/assets/images/anonymous-messenger.png"
              alt="logo"
              width={40}
              height={32}
              className="hidden dark:block"
            />

            <Image
              src="/assets/images/anonymous-messenger_light.png"
              alt="logo"
              width={40}
              height={32}
              className="block dark:hidden"
            />
          </Link>


          <div className="md:hidden">
            <ProgressBetaBadge progress={30} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="block md:hidden" id="sign-out">
            <Button
              variant={'ghost'}
              className="shad-button_ghost"
              onClick={e => handleSignOut(e)}
            >
              <LogoutIcon height="23" />
            </Button>
          </div>
          <MobileNav />
        </div>

        <div className="hidden gap-x-5 md:flex">
          <ThemeSwitch />
          <div>
            <ProgressBetaBadge progress={30} />
          </div>
        </div>
      </nav>

      <SignoutAlert isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default Topbar;

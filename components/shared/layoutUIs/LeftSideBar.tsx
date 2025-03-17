'use client';

import React,{ useEffect, useState } from 'react';
import { sidebarLinks } from '@/constants';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { LogoutIcon } from '../../animated/Icons/LogoutIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../../ui/button';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useUserState } from '@/lib/store/user';
import SignoutAlert from '../SignoutAlert';

interface SidebarLinkInterface{
  icon: React.JSX.Element,
  route: string;
  label: string;
}

function LeftSidebar() {
  // get user profile data
  const user = useUserState(state => state.user);
  const router = useRouter();
  const pathName = usePathname();
  const supabase = getSupabaseBrowserClient();

  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (user?.is_anonymous) {
      setIsOpen(true);
      return;
    }
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
      <section className="custom-scrollbar leftsidebar">
        <div className="flex w-full flex-1 flex-col gap-6 px-6">
          <div className="mb-10 flex flex-row items-center gap-x-2 py-2">
            <Avatar>
              <AvatarImage src={user?.avatar_url ?? undefined} />
              <AvatarFallback>XO🦸</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h5 className="text-small text-default-400 tracking-tight text-dark-2 dark:text-light-3 max-lg:hidden">
                {user?.username}
              </h5>
            </div>
          </div>
          {sidebarLinks.map((link: SidebarLinkInterface) => {
            const isActive =
              (pathName.includes(link.route) && link.route.length > 1) ||
              pathName == link.route;

            return (
              <Link
                href={link.route}
                key={link.label}
                className={`leftsidebar_link ${isActive && 'bg-primary-500'} hover:bg-primary-500`}
              >
                {link.icon}
                <p className="text-dark-2 dark:text-light-1 max-lg:hidden">
                  {link.label}
                </p>
              </Link>
            );
          })}
        </div>
        <div className="mt-10 px-6">
          <Button
            variant={'ghost'}
            className="shad-button_ghost"
            onClick={e => handleSignOut(e)}
          >
            <LogoutIcon />
            <p className="text-dark-2 dark:text-light-1 max-lg:hidden">
              Logout
            </p>
          </Button>
        </div>
      </section>

      <SignoutAlert isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default LeftSidebar;

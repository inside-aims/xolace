"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import ThemeSwitch from "../ui/ThemeSwitch";
import { MenuToggle } from "../ui/MenuToggle";
import MobileNav from "./MobileNav";
import { Button } from "../ui/button";
import LogoutIcon from "../icons/LogoutIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import SignoutAlert from "./SignoutAlert";
import { useUserState } from "@/lib/store/user";

function Topbar() {
  // get user profile data
  const user = useUserState((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if(user.is_anonymous){
      setIsOpen(true);
      return;
    }

    supabase.auth.signOut();
  };

  // Subscribe to sign out event
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push(`/sign-in`);
      }
    });

    // end subscription event
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
    
    <nav className=" topbar ">
      <div className=" flex items-center gap-x-4">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/assets/images/anonymous-messenger.png"
            alt="logo"
            width={32}
            height={32}
            className="hidden dark:block"
          />

<Image
            src="/assets/images/anonymous-messenger_light.png"
            alt="logo"
            width={32}
            height={32}
            className="dark:hidden block"
          />
        </Link>
        <div className="shrink-0 flex items-center z-40 relative">
          <Link href={"/feed"} className="max-md:hidden">
            <div className=" font-tiltNeon font-tilt z-50  text-[35px]  text-center">
              <span className="letter-mask">X</span>
              <span className="letter-mask !text-amber-400">o</span>
              <span className="letter-mask">l</span>
              <span className="letter-mask">a</span>
              <span className="letter-mask">c</span>
              <span className="letter-mask">e</span>
            </div>
          </Link>
        </div>
      </div>

      <div className=" flex items-center gap-5">
        <div className=" block md:hidden">
          <Button
            variant={"ghost"}
            className="  shad-button_ghost"
            onClick={(e) => handleSignOut(e)}
          >
            <LogoutIcon />
          </Button>
        </div>
        <MobileNav />
      </div>

      <div className=" hidden md:block">
        <ThemeSwitch />
      </div>
    </nav>

    <SignoutAlert isOpen={isOpen} setIsOpen={setIsOpen}/>
    </>
  );
}

export default Topbar;

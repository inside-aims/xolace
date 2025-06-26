'use client';

import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import {useUserState} from "@/lib/store/user";
import DeleteUserAccountCard from "@/components/cards/DeleteUserAccountCard";


export default function DeletePage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <DeleteContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <DeleteContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function DeleteContent() {
  const user = useUserState(state => state.user);

  return(
    <SettingsNavigationWrapper title={"Delete account"}>
      <div className={"w-full flex flex-col items-start gap-4 max-sm:pb-20"}>
        <div className={"w-full flex flex-col items-start px-4 gap-4 md:gap-8"}>
          <div className={"flex flex-row gap-4"}>
            <Avatar>
              <AvatarImage src={user?.avatar_url ?? undefined} />
              <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className={"flex flex-col"}>
              <span className={"font-semibold"}>{user?.username}</span>
              <span className={"text-sm text-neutral-400 lowercase"}>{`@${user?.username}`}</span>
            </p>
          </div>
          <div className={"leading-normal"}>
            <h4 className={"font-semibold text-xl"}>This will permanently delete your account</h4>
            <p className={"text-neutral-400 pt-4 text-sm"}>
              You are about to start the process of deleting your xolace account.
              For now your display name, @username, and public profile will no longer be viewable
              on xolace.com
            </p>
          </div>
          <div className={"leading-normal"}>
            <h4 className={"font-semibold text-xl"}>
              What else you should know</h4>
            <p className={"text-neutral-400 pt-4 text-sm"}>
              You can not restore your xolace account if it was accidentally or wrongfully
              deleted.
            </p>
          </div>
        </div>
        <div className={"w-full flex flex-col items-start gap-4"}>
          <div className={"w-full border-t"}>
            <p className={"text-neutral-400 px-4 pt-2 text-sm"}>
              If you want to download your
              <span className={"font-semibold hover:underline text-blue9 cursor-pointer"}> xolace
                data </span>, you&apos;ll need to complete both the request and download process before
              deactivating your account. Links to download your data cannot be sent to
              deactivated accounts.
            </p>
          </div>
          <div className={"w-full flex border-t py-5 px-4"}>
          <DeleteUserAccountCard/>
          </div>
          

        </div>
      </div>
    </SettingsNavigationWrapper>
  )
}
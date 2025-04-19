'use client';

import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import SettingsWrapper from "@/components/settings/settings-wrapper";
import { Checkbox } from "@/components/ui/checkbox"

export default function ProtectedPostPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <ProtectedPostContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <ProtectedPostContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function ProtectedPostContent() {

  return (
    <SettingsNavigationWrapper title="Protected post">
      <div className={"w-full flex flex-col items-start gap-4"}>
        <p className={"w-full text-neutral-400 px-4"}>
          {`Manage the information you allow other people on Xolace to see`}
        </p>
        <div className={"w-full flex flex-col items-start px-4"}>
          <h4 className={"w-full flex items-center font-normal justify-between text-lg"}>
           Protects your posts
            <span className={"justify-end ml-auto"}>
              <Checkbox defaultChecked={true}/>
           </span>
          </h4>
          <span className={'text-sm text-neutral-400'}>
            {`When selected, your posts and other account information are only visible to people who follow you. `}
            <span className={"hover:underline text-blue9 cursor-pointer"}> Learn more </span>
          </span>
        </div>
      </div>
    </SettingsNavigationWrapper>
  );
}

'use client';

import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";

export default function HelpCenterPage() {
  return (
    <>
      <div className='w-full flex items-center flex-col md:hidden'>
        <HelpCenterContent/>
      </div>
      <div className="w-full hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <HelpCenterContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

const HelpCenterContent = () =>{
  return(
    <SettingsNavigationWrapper title={'Help Center'}>
      <div className={"w-full flex flex-col items-center justify-center min-h-screen"}>
        <h2 className={"text-xl  md:text-4xl  font-semibold"}>
          Feature coming soon
        </h2>
      </div>
    </SettingsNavigationWrapper>
  )
}
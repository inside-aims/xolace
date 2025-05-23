"use client"

import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import SettingsWrapper from "@/components/settings/settings-wrapper";
import {Checkbox} from "@/components/ui/checkbox";
import { usePreferencesStore } from "@/lib/store/preferences-store";

export default  function YourPostsPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <YourPostsPageContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <YourPostsPageContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function YourPostsPageContent() {

  const {preferences, isLoading, error, updatePreference} = usePreferencesStore();

  if (isLoading &&!preferences) {
    return (
        <SettingsNavigationWrapper title={'Preferences'}>
            <div className="p-4">Loading preferences...</div>
        </SettingsNavigationWrapper>
    );
  }
  if (error) {
    return (
        <SettingsNavigationWrapper title={'Preferences'}>
            <div className="p-4 text-red-500">Error loading preferences: {error}</div>
        </SettingsNavigationWrapper>
    )
  }

  const handleToggleSensitiveByDefault = (checked: boolean) => {
    updatePreference('mark_sensitive_by_default', checked);
  };

  return(
    <SettingsNavigationWrapper title="Your posts">
      <div className={"w-full flex flex-col items-start gap-4"}>
        <p className={"w-full text-neutral-400 px-4"}>
          {`Manage the information associated with your posts.`}
        </p>
        <div className={"w-full flex flex-col items-start px-4"}>
          <h4 className={"w-full flex items-center font-normal justify-between text-lg"}>
            Mark media you post as having material that may be sensitive
            <span className={"justify-end ml-auto"}>
              <Checkbox 
              checked={preferences ? preferences.mark_sensitive_by_default : false} 
              onCheckedChange={handleToggleSensitiveByDefault}
              disabled={isLoading}
              />
           </span>
          </h4>
          <span className={'text-sm text-neutral-400'}>
            {` When enabled, your post will be marked as sensitive for people who don’t want to see sensitive content. `}
            <span className={"hover:underline text-blue9 cursor-pointer"}> Learn more </span>
          </span>
        </div>

        {/*<Link*/}
        {/*  href={''}*/}
        {/*  className={"w-full flex flex-col items-start cursor-pointer py-4  hover:bg-neutral-100 dark:hover:bg-neutral-900"}>*/}
        {/*  <h4 className={"px-4 w-full flex items-center justify-between text-lg"}>*/}
        {/*    Add location information to your posts*/}
        {/*    <span className={"justify-end ml-auto"}>*/}
        {/*      <ChevronRight/>*/}
        {/*   </span>*/}
        {/*  </h4>*/}
        {/*</Link>*/}
      </div>
    </SettingsNavigationWrapper>
  )
}
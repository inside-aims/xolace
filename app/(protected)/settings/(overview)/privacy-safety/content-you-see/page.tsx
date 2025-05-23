"use client"

import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import SettingsWrapper from "@/components/settings/settings-wrapper";
import {Checkbox} from "@/components/ui/checkbox";
import {ChevronRight} from "lucide-react";
import Link from 'next/link'
import { usePreferencesStore } from "@/lib/store/preferences-store";

const contentToSee: {contentKey: string, label: string, href: string}[] = [
  {contentKey: "topics", label: "Topics", href: ''},
  {contentKey: "interest", label: "Interests", href: ''},
  {contentKey: "exploreSettings", label: "Explore settings", href: ''},
  {contentKey: "searchSettings", label: "Search Settings", href: ''}
]

export default  function ContentYouSeePage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <ContentYouSeeContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <ContentYouSeeContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function ContentYouSeeContent() {

  const { preferences, isLoading , updatePreference, error } = usePreferencesStore();

  const handleToggleShowSensitiveContent = (checked: boolean) => {
    updatePreference('show_sensitive_content', checked);
  };

  if(isLoading && !preferences){
    return (
      <SettingsNavigationWrapper title="Content you See">
          <div className="p-4">Loading preferences...</div>
      </SettingsNavigationWrapper>
    )
  }
  if (error) {
    return (
        <SettingsNavigationWrapper title={'Preferences'}>
            <div className="p-4 text-red-500">Error loading preferences: {error}</div>
        </SettingsNavigationWrapper>
    )
  }

  return(
    <SettingsNavigationWrapper title="Content you see">
      <div className={"w-full flex flex-col items-start gap-4"}>
        <p className={"w-full text-neutral-400 px-4"}>
          {`Decide what you see on Xolace, based on your preferences like Topic and interests`}
        </p>
        <div className={"w-full flex flex-col items-start px-4"}>
          <h4 className={"w-full flex items-center justify-between text-lg"}>
            Display media that may contain sensitive content
            <span className={"justify-end ml-auto"}>
              <Checkbox 
              checked={preferences ? preferences.show_sensitive_content : false}
              onCheckedChange={handleToggleShowSensitiveContent}
              disabled={isLoading}
              />
           </span>
          </h4>
        </div>
        <div className={"w-full flex flex-col items-start "}>
          {
            contentToSee.map((item) => (
              <Link
                key={item.contentKey}
                href={item.href}
                className={"w-full flex flex-col items-start cursor-pointer py-4  hover:bg-neutral-100 dark:hover:bg-neutral-900"}>
                <h4 className={"px-4 w-full flex items-center justify-between text-lg"}>
                  {item.label}
                  <span className={"justify-end ml-auto"}>
                    <ChevronRight/>
                  </span>
                </h4>
              </Link>
            ))
          }
        </div>
      </div>
    </SettingsNavigationWrapper>
  )
}
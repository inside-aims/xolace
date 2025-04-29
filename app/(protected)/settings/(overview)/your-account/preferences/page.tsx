'use client';

import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import {Switch} from "@/components/ui/switch";
import {useState} from "react";

interface PreferenceOptionsInterface {
  key: string;
  label: string;
  description: string;
  state: boolean;
}

//Customize experience option for user
const customizeExperience: PreferenceOptionsInterface[] = [
  {
    key: "guidedTour",
    label: "Guided Tour",
    description: "Enable a guided tour to help you understand how things work on the platform",
    state: true,
  },
  {
    key: "autoSaveDrafts",
    label: "Save Drafts Automatically",
    description: "We'll save your thoughts while you type just in case.",
    state: true,
  },
  {
    key: "dailyPrompt",
    label: "Daily Prompt",
    description: "A quiet nudge each day to help you express yourself.",
    state: false,
  },
  {
    key: "allowAnonymousReplies",
    label: "Let People Reply Anonymously",
    description: "Responses won’t show who they're from, keeping the space safe.",
    state: true,
  },
]


export default function PreferencesPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <PreferencesContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <PreferencesContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function PreferencesContent() {
  const [preference, setPreference] = useState<PreferenceOptionsInterface[]>(customizeExperience);

  const togglePreference = (optionKey: string) => {
    setPreference((prev) =>
      prev.map((option) =>
        option.key === optionKey
          ? { ...option, state: !option.state }
          : option
      )
    );
  };

  return(
    <SettingsNavigationWrapper title={'Preferences'}>
      <div className={"w-full flex flex-col items-start px-4 gap-4"}>
        <div className={"leading-normal"}>
          <h4 className={"font-semibold text-xl"}>Customise your experience</h4>
          <p className={"text-neutral-400 text-sm w-full md:w-[80%]"}>
            Choose how you want to experience the platform.
            Everything here is built to keep you safe, anonymous, and in control.
          </p>
        </div>
        {/*possible customize experience*/}
        <div className={"w-full flex flex-col items-start gap-4"}>
          {
            preference.map((item) => (
              <div className={"w-full flex flex-col items-start"} key={item.key}>
                <h4 className={"w-full flex items-center justify-between"}>
                  {item.label}
                  <span className={"justify-end ml-auto"}>
                    <Switch checked={item.state} onCheckedChange={() => togglePreference(item.key)}/>
                  </span>
                </h4>
                <p className={"text-sm text-neutral-500"}>
                  {item.description}
                </p>
              </div>
            ))
          }
        </div>
      </div>
    </SettingsNavigationWrapper>
  )
}
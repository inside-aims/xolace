import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import SettingsWrapper from "@/components/settings/settings-wrapper";
import {Checkbox} from "@/components/ui/checkbox";
import {ChevronRight} from "lucide-react";
import Link from 'next/link'

const discoverabilityOptions: {
  optionKey: string,
  label: string,
  description: string,
  optionStatus: boolean}[] = [
  {
    optionKey: 'findByEmail',
    label: 'Let people who have your email address find you on Xolace',
    description: 'Let people who have your email find you and connect',
    optionStatus: false
  },
  {
    optionKey: 'findByPhoneNumber',
    label: 'Let people who have your phone number find you on Xolace',
    description: 'Let people who have your phone number find you and connect',
    optionStatus: false
  }
]

export default  function DiscoverabilityContactsPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <DiscoverabilityContactsContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <DiscoverabilityContactsContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function DiscoverabilityContactsContent() {
  return(
    <SettingsNavigationWrapper title="Discverability contacts">
      <div className={"w-full flex flex-col items-start gap-4"}>
        <p className={"w-full text-neutral-400 px-4"}>
          {`Control your discoverability settings and manage contacts you have imported`}
        </p>
        <div className={"w-full flex flex-col items-start px-4 gap-4"}>
          <h4 className={"font-semibold w-full flex items-center justify-between text-lg"}>
            Discoverability
          </h4>
          <p className={"w-full text-neutral-400"}>
            Decide whether people who have your email address or phone number can find
            and connect with you on Xolace.
          </p>
          {
            discoverabilityOptions.map((option) => (
              <div className={"w-full flex flex-col items-center"} key={option.optionKey}>
                <h4 className={"w-full flex items-center justify-between"}>
                  {option.label}
                  <span><Checkbox defaultChecked={option.optionStatus}/></span>
                </h4>
                <p className={"w-full text-neutral-400 text-sm"}>
                  {option.description}
                </p>
              </div>
            ))
          }
        </div>
        <div className={"w-full border-t "}>
          <div className={"w-full flex flex-col items-start pt-2 gap-4"}>
            <h4 className={"text-lg font-semibold px-4"}>
              Contacts
            </h4>
            <p className={"w-full text-neutral-400 px-4"}>
              Manage contacts that you have imported from your mobile devices.
              <span className={"text-blue9 hover:underline"}>Learn more</span>
            </p>
            <div className={"w-full flex flex-col items-start"}>
              <Link
                href={''}
                className={"w-full flex flex-col items-start cursor-pointer py-4  hover:bg-neutral-100 dark:hover:bg-neutral-900"}>
                <h4 className={"px-4 w-full flex items-center justify-between text-lg"}>
                  Manage contacts
                  <span className={"justify-end ml-auto"}><ChevronRight/></span>
                </h4>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SettingsNavigationWrapper>
  )
}
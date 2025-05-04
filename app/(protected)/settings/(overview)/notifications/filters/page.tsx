import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import SettingsWrapper from "@/components/settings/settings-wrapper";
import {Checkbox} from "@/components/ui/checkbox";
import {ChevronRight} from "lucide-react";
import Link from 'next/link'


export default  function FiltersPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <FiltersContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <FiltersContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function FiltersContent() {
  return(
    <SettingsNavigationWrapper title="Filters">
      <div className={"w-full flex flex-col items-start gap-8"}>
        <p className={"w-full text-neutral-400 px-4"}>
          {`Choose the notification you'd like to see - and those you don't.`}
        </p>
        <div className={"w-full flex flex-col items-start px-4"}>
          <h4 className={"w-full flex items-center justify-between text-lg"}>
            Quality filters
            <span className={"justify-end ml-auto"}>
              <Checkbox defaultChecked={true}/>
           </span>
          </h4>
          <span className={'text-sm text-neutral-400'}>
            {` Choose to filter out content such as duplicate or automated posts.
            This doesn't apply to notifications from accounts you follow or have
            interacted with recently. `}
            <span className={"hover:underline text-blue9 cursor-pointer"}> Learn more </span>
          </span>
        </div>

        <Link
          href={'/settings/notifications/muted-notifications'}
          className={"w-full flex flex-col items-start cursor-pointer py-4  hover:bg-neutral-100 dark:hover:bg-neutral-900"}>
          <h4 className={"px-4 w-full flex items-center justify-between text-lg"}>
            Muted notifications
            <span className={"justify-end ml-auto"}>
              <ChevronRight/>
           </span>
          </h4>
        </Link>
      </div>
    </SettingsNavigationWrapper>
  )
}
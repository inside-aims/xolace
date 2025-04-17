import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import Link from "next/link";
import {ChevronRight} from "lucide-react";

const appsSessionsContentOption: {label: string, key: string, href: string}[] = [
  {
    label: "Sessions",
    key: 'sessions',
    href: "/settings/security-access/sessions",
  },
]
export default  function AppsSessionsPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <AppsSessionContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <AppsSessionContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function AppsSessionContent() {
  return(
    <SettingsNavigationWrapper title="Apps and sessions">
      <div className={"w-full flex flex-col items-start gap-2"}>
        <p className={"w-full text-neutral-400 px-4"}>
          {`Decide what you see on Xolace, based on your preferences like Topic and interests`}
        </p>
        <div className={"w-full flex flex-col items-start gap-4"}>
          {
            appsSessionsContentOption.map((item) => (
              <div className={"flex flex-col w-full"} key={item.key}>
                <Link
                  href={item.href}
                  className={"py-4 w-full flex hover:bg-neutral-100 dark:hover:bg-neutral-900"}>
                  <p className={" px-4 w-full flex items-center justify-between text-lg"}>
                    {item.label}
                    <span className={"justify-end ml-auto"}>
                      <ChevronRight/>
                    </span>
                  </p>
                </Link>
              </div>
            ))
          }
        </div>
      </div>
    </SettingsNavigationWrapper>
  )
}
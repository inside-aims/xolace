import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import SettingsWrapper from "@/components/settings/settings-wrapper";
import {ChevronRight} from "lucide-react";
import Link from 'next/link'

const muteAndBlock: {contentKey: string, label: string, href: string}[] = [
  {contentKey: "blockedAccounts", label: "Blocked accounts", href: ''},
  {contentKey: "mutedAccounts", label: "Muted accounts", href: ''},
  {contentKey: "mutedWords", label: "Muted words", href: ''},
  {contentKey: "mutedNotifications", label: "Muted notifications", href: ''}
]

export default  function MuteAndBlockPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        < MuteAndBlockContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          < MuteAndBlockContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function MuteAndBlockContent() {
  return(
    <SettingsNavigationWrapper title="Content you see">
      <div className={"w-full flex flex-col items-start gap-4"}>
        <p className={"w-full text-neutral-400 px-4"}>
          {`Manage the accounts, words, and notifications that you’ve muted or blocked.`}
        </p>
        <div className={"w-full flex flex-col items-start"}>
          {
            muteAndBlock.map((item) => (
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
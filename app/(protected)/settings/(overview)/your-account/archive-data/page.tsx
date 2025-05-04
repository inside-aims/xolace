import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import {Button} from '@/components/ui/button';
import { MoveUpRight } from 'lucide-react';

export default function ArchivePage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <ArchiveContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <ArchiveContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function ArchiveContent() {
  return(
    <SettingsNavigationWrapper title={"Download an archive of your data"}>
      <div className={"w-full flex flex-col items-start gap-8"}>
        <p className={"w-full text-neutral-400 px-4"}>
          Get insights into the type of information stored for your account.
        </p>
        <div className={"w-full flex flex-col items-start px-4 gap-8"}>
          <h4 className={"font-semibold text-lg"}>
            Xolace data
          </h4>
          <p className={"text-neutral-400   text-sm"}>
            You can request a ZIP file with an archive of your account information,
            account history, apps and devices, account activity, interests,
            and Ads data. You’ll get an in-app notification when the archive of your data
            is ready to download.
            <span className={"hover:underline text-blue9"}>  Learn more </span>
          </p>
          <div className={"w-full flex items-center justify-between"}>
            <p>Xolace</p>
            <Button className={"px-8 bg-blue9 hover:bg-blue10 rounded-full font-semibold text-white"}>
              Request archive
            </Button>
          </div>
        </div>
        <div className={"w-full border-t py-4 "}>
          <h4 className={"font-semibold text-lg px-4 pb-2"}>
            Periscope data
          </h4>
          <Button className={"w-full px-4 py-6 rounded-none text-sm items-center justify-between"} variant="ghost">
            You can request an archive of your account information, account history,and devices.
            <span className={""}>
              <MoveUpRight size={18}/>
            </span>
          </Button>
        </div>
      </div>
    </SettingsNavigationWrapper>
  )
}
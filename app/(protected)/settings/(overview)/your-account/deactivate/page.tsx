import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import Image from 'next/image';
import {Button} from "@/components/ui/button";


export default function DeactivatePage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <DeactivateContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <DeactivateContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function DeactivateContent() {
  return(
    <SettingsNavigationWrapper title={"Deactivate account"}>
      <div className={"w-full flex flex-col items-start gap-8"}>
        <div className={"w-full flex flex-col items-start px-4 gap-4 md:gap-8"}>
          <div className={"flex flex-row gap-8"}>
            <Image
              src={''}
              alt={'profile iamge'}
              className="object-cover rounded-full w-8 h-8 "
            />
            <p className={"flex flex-col"}>
              <span className={"font-semibold"}>F E D E J N R</span>
              <span className={"text-neutral-400"}>@fedejnr08</span>
            </p>
          </div>
          <div className={"leading-normal"}>
            <h4 className={"font-semibold text-xl"}>This will deactivate your account</h4>
            <p className={"text-neutral-400 pt-4 text-sm"}>
              You’re about to start the process of deactivating your xolace account.
              Your display name, @username, and public profile will no longer be viewable
              on xolace.com
            </p>
          </div>
          <div className={"leading-normal"}>
            <h4 className={"font-semibold text-xl"}>
              What else you should know</h4>
            <p className={"text-neutral-400 pt-4 text-sm"}>
              You can restore your xolace account if it was accidentally or wrongfully
              deactivated for up to 30 days after deactivation.
            </p>
          </div>
        </div>

        <div className={"w-full flex flex-col items-start gap-4"}>
          <div className={"w-full border-t"}>
            <p className={"text-neutral-400 px-4 pt-2 text-sm"}>
              Some account information may still be available in search engines, such as
              Google or Bing . <span className={"font-semibold hover:underline text-blue9 cursor-pointer"}>
              Learn more </span>
            </p>
          </div>
          <div className={"w-full border-t"}>
            <p className={"text-neutral-400 px-4 pt-2 text-sm"}>
              If you just want to change your @username, you don’t need to deactivate your
              account — edit it in your <span className={"font-semibold hover:underline text-blue9 cursor-pointer"}> settings </span>
            </p>
          </div>
          <div className={"w-full border-t"}>
            <p className={"text-neutral-400 px-4 pt-2 text-sm"}>
              To use your current @username or email address with a different xolace account,
              <span className={"font-semibold hover:underline text-blue9 cursor-pointer"}>
                change them </span> before you deactivate this account.
            </p>
          </div>
          <div className={"w-full border-t"}>
            <p className={"text-neutral-400 px-4 pt-2 text-sm"}>
              If you want to download your
              <span className={"font-semibold hover:underline text-blue9 cursor-pointer"}> xolace
                data </span>, you’ll need to complete both the request and download process before
              deactivating your account. Links to download your data cannot be sent to
              deactivated accounts.
            </p>
          </div>
          <div className={"w-full flex items-center justify-center border-t"}>
            <Button variant={"ghost"} className={"py-6 text-red-500 w-full flex"}>
              Deactivate account
            </Button>
          </div>

        </div>
      </div>
    </SettingsNavigationWrapper>
  )
}
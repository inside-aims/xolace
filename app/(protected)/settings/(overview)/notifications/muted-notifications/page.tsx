import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import {Checkbox} from "@/components/ui/checkbox";

interface MutedNotification {
  optionKey: string;
  label: string;
  status: boolean;
}

const mutedNotificationOptions: MutedNotification[] = [
  {optionKey: "youDontFollow", label: "You don't follow ", status: false},
  {optionKey: "whoDontFollowYou", label: "Who don't follow you", status: false},
  {optionKey: "withNewAccount", label: "With a new account", status: false },
  {optionKey: "defaultProfilePhoto", label: "Who have a default profile photo", status: false},
  {optionKey: "unconfirmedEmail", label: "Who haven't confirmed their email", status: false},
  {optionKey: "unconfirmedPhoneNumber", label: "Who haven't confirmed their phone number", status: false},

]
export default function MutedNotificationsPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <MutedNotificationsContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <MutedNotificationsContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function MutedNotificationsContent() {
  return(
    <SettingsNavigationWrapper title={'Muted notifications'}>
      <div className={"w-full flex flex-col items-start gap-8 px-4"}>
        <h4 className={"text-lg font-semibold"}>
          Muted notifications from people:
        </h4>
        <div className={"flex w-full flex-col items-start gap-8"}>
          {
            mutedNotificationOptions.map((option) => (
              <p className={"w-full flex items-center justify-between"} key={option.optionKey}>
                {option.label}
                <span><Checkbox defaultChecked={option.status}/></span>
              </p>
            ))
          }
        </div>
        <p className={"text-neutral-400 text-sm"}>
          These filters won’t affect notifications from people you follow.
          <span className={"text-blue9 hover:underline cursor-pointer"}> Learn more </span>
        </p>
      </div>
    </SettingsNavigationWrapper>
  )
}
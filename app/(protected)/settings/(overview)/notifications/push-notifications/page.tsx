import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

interface PushNotificationsLabelStatus {
  labelStatusKey: string;
  label: string;
  status: boolean
}

interface PushNotificationsProps {
  actionKey: string;
  action: string;
  children?: PushNotificationsLabelStatus[]
}

// Push notification settings various options
const pushNotificationOptions: PushNotificationsProps[] = [
  {
    actionKey: "mentionAndReplies",
    action: "Mention and replies",
    children: [
      { labelStatusKey: "tailoredForYour", label: "Tailored for you", status: false },
      { labelStatusKey: "fromAnyone", label: "From anyone", status: false },
      { labelStatusKey: "off", label: "Off", status: false },
    ]
  },
  {
    actionKey: "likes",
    action: "Likes",
    children: [
      { labelStatusKey: "tailoredForYour", label: "Tailored for you", status: false },
      { labelStatusKey: "fromAnyone", label: "From anyone", status: false },
      { labelStatusKey: "off", label: "Off", status: false },
    ]
  },
  {
    actionKey: "reposts",
    action: "Reposts",
    children: [
      { labelStatusKey: "tailoredForYour", label: "Tailored for you", status: false },
      { labelStatusKey: "fromAnyone", label: "From anyone", status: false },
      { labelStatusKey: "off", label: "Off", status: false },
    ]
  }
]
export default function PushNotificationsPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <PushNotificationsContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <PushNotificationsContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function PushNotificationsContent() {
  return(
    <SettingsNavigationWrapper title={'Push notifications'}>
      <div className={"w-full flex flex-col items-start gap-4"}>
        <div className={"w-full flex flex-col items-start px-4"}>
          <h4 className={"w-full text-lg flex items-center justify-between"}>
            Push notifications
            <span >
              <Switch />
            </span>
          </h4>
          <p className={'text-sm text-neutral-400'}>
            Get push notifications to find out what’s going on when you’re not on xolace.
            You can turn them off anytime.
          </p>
        </div>
        <div className={"w-full border-t "}>
          <div className={"w-full flex flex-col items-start px-4 pt-2 gap-4"}>
            <h4 className={"text-lg font-semibold"}>
              Related to you and your posts
            </h4>
            <div className={"w-full flex flex-col items-start"}>
              <h4 className={"w-full text-lg flex items-center justify-between"}>
                Posts
                <span><Checkbox defaultChecked={true}/></span>
              </h4>
              <p className={'text-sm text-neutral-400'}>
                When you turn on post notifications from people you follow, you’ll get push
                notifications about their posts.
                <span className={"text-blue9 hover:underline cursor-pointer"}>View users</span>
              </p>
              <div className={"w-full flex flex-col items-start gap-4 pt-4"}>
                {
                  pushNotificationOptions.map((option) => (
                    <div className={"w-full flex flex-col items-start"} key={option.actionKey}>
                      <h4 className={"w-full font-semibold"}>
                        {option.action}
                      </h4>
                      {
                        option.children && (
                          option.children.map((option) => (
                            <h6
                              className={"w-full flex items-center justify-between font-light"}
                              key={option.labelStatusKey}
                            >
                              {option.label}
                              <span><Checkbox defaultChecked={option.status}/></span>
                            </h6>
                          ))
                        )
                      }
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsNavigationWrapper>
  )
}
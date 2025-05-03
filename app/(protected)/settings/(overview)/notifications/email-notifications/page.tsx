import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

interface EmailNotificationsLabelStatus {
  labelStatusKey: string;
  label: string;
  status: boolean;
}

interface EmailNotificationsProps {
  actionKey: string;
  action: string;
  actionStatus?: boolean
  children?: EmailNotificationsLabelStatus[]
}

// Email notification related to you and your post
const emailNotificationOptions: EmailNotificationsProps[] = [
  {actionKey: "newNotifications", action: "New Notifications", actionStatus: false},
  {actionKey: "directMessages", action: "Direct messages", actionStatus: false},
  {actionKey: "emailedToYou", action: "Post emailed to you", actionStatus: false},
  {
    actionKey: "topPostsAndStories",
    action: "Top posts and stories",
    children: [
      { labelStatusKey: "daily", label: "Daily", status: false },
      { labelStatusKey: "weekly", label: "Weekly", status: false },
      { labelStatusKey: "periodically", label: "Periodically", status: false },
      { labelStatusKey: "off", label: "Off", status: false },
    ]
  },
  {actionKey: "postsPerformance", action: "Updates about the performance of your posts", actionStatus: false},
]

// Email notification from xolace
const emailNotificationFromXolace: EmailNotificationsProps[] = [
  {
    actionKey: "xolaceProductAndFeatures",
    action: "News about Xolace product and feature updates",
    actionStatus: false
  },
  {
    actionKey: "missedSinceLastLogin",
    action: "Things you missed since you last logged into Xolace",
    actionStatus: false
  },
  {
    actionKey: "xolaceOnProductPartner",
    action: "News about Xolace on partner products and other third party services",
    actionStatus: false
  },
  {
    actionKey: "xolaceSurveyReserach",
    action: 'Participation in Xolace research surveys',
    actionStatus: false
  },
  {
    actionKey: "suggestionOnRecentFollows",
    action: "Suggestions based on your recent follows",
    actionStatus: false
  }
];

export default function EmailNotificationsPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <EmailNotificationsContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <EmailNotificationsContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function EmailNotificationsContent() {
  return(
    <SettingsNavigationWrapper title={'Email notifications'}>
      <div className={"w-full flex flex-col items-start gap-4"}>
        <div className={"w-full flex flex-col items-start px-4"}>
          <h4 className={"w-full text-lg flex items-center justify-between"}>
            Email notifications
            <span>
              <Switch/>
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
              <div className={"w-full flex flex-col items-start gap-4"}>
                {
                  emailNotificationOptions.map((option) => (
                    <div className={"w-full flex flex-col items-start"} key={option.actionKey}>
                      <h4 className={`w-full flex items-center justify-between ${option.actionStatus !== undefined ? 'font-light' : 'font-semibold'}`}>
                        { option.action }
                        { option.actionStatus !== undefined && (
                          <span><Checkbox defaultChecked={option.actionStatus}/></span>
                        )}
                      </h4>
                      {option.children && (
                           option.children.map((option) => (
                            <h6 className={"w-full flex items-center justify-between font-light"}
                              key={option.labelStatusKey}>
                              {option.label} <span><Checkbox defaultChecked={option.status}/></span>
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
        {/*email notification from xolace*/}
        <div className={"w-full border-t "}>
          <div className={"w-full flex flex-col items-start px-4 pt-2 gap-4"}>
            <h4 className={"text-lg font-semibold"}>
             From Xolace
            </h4>
            <div className={"w-full flex flex-col items-start"}>
              <div className={"w-full flex flex-col items-start gap-4"}>
                {
                  emailNotificationFromXolace.map((option) => (
                    <h4 key={option.actionKey} className={`w-full flex items-center font-light justify-between`}>
                      {option.action} <span><Checkbox defaultChecked={option.actionStatus}/></span>
                    </h4>
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
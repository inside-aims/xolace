import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsCard, SettingsOptionProps} from "@/components/settings/settings-card";
import { MonitorCog, SlidersHorizontal } from "lucide-react";

const notificationOptions: SettingsOptionProps[] = [
  {
    icon: <SlidersHorizontal/>,
    label: 'Filters',
    route: '/settings/notifications/filters',
    description: "Choose the notification you'd like to see - and those you don't",
  },
  {
    icon: <MonitorCog/>,
    label: 'Preferences',
    route: '/settings/notifications/preferences',
    description: 'Select your preferences by notification type',
  },
]

export default function NotificationsPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <NotificationContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <NotificationContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function NotificationContent() {
  return(
    <SettingsCard
      name={'Notifications'}
      overview={'Select the kinds of notifications you get about your activities, interests, and recommendation.'}
      options={notificationOptions}
    />
  )
}

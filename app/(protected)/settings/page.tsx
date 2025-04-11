import type { Metadata } from 'next'
import { User, Lock, Archive, Power,} from 'lucide-react';
import {SettingsCard, SettingsOptionProps} from "@/components/settings/settings-card";
import SettingsWrapper from "@/components/settings/settings-wrapper";

export const metadata: Metadata = {
  title: 'Settings',
}

// Various settings option under the your(user) account
const yourAccountSettings: SettingsOptionProps[] = [
  {
    settingsKey: 'accountInformation',
    icon: <User/>,
    label: 'Account Information',
    route: '/settings/your-account',
    description: 'See your account information like your phone number and email',
  },
  {
    settingsKey: 'changePassword',
    icon: <Lock/>,
    label: 'Change Password',
    route: '/settings/your-account/password',
    description: 'Change your password at any time',
  },
  {
    settingsKey: 'archiveData',
    icon: <Archive/>,
    route: '/settings/your-account/archive-data',
    label: 'Download an archive of your data',
    description: 'Get insights into the type of information stored for your account ',
  },
  {
    settingsKey: 'deactivateAccount',
    icon: <Power/>,
    route: '/settings/your-account/deactivate',
    label: 'Deactivate your account',
    description: 'Find out how you can deactivate your account'
  }
]

export default function SettingsPage() {
  return (
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <SettingsContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <SettingsContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function SettingsContent() {
  return(
    <SettingsCard
      cardKey={'youAccount'}
      name={'Your Account'}
      overview={'See information about your account, download an archive of your data, or learn about your account deactivation options'}
      options={yourAccountSettings}
    />
  )
}
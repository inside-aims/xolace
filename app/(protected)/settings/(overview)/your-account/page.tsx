import type { Metadata } from 'next'
import {User, Lock, Power, MonitorCog,FileX} from 'lucide-react';
import {SettingsCard, SettingsOptionProps} from "@/components/settings/settings-card";
import SettingsWrapper from "@/components/settings/settings-wrapper";

export const metadata: Metadata = {
  title: 'Settings',
}

// Various settings option under the your(user) account
const yourAccountSettings: SettingsOptionProps[] = [
  {
    icon: <User/>,
    label: 'Account Information',
    route: '/settings/your-account/info',
    description: 'See your account information like your phone number and email',
  },
  {
    icon: <Lock/>,
    label: 'Change Password',
    route: '/settings/your-account/password',
    description: 'Change your password at any time',
  },
  {
    icon: <MonitorCog/>,
    label: 'Preferences',
    route: '/settings/your-account/preferences',
    description: 'Customize your account experience',
  },
  // {
  //   icon: <Archive/>,
  //   route: '',          //Note: Set the empty string to this route "/settings/your-account/archive-data"
  //   label: 'Download an archive of your data',
  //   description: 'Get insights into the type of information stored for your account ',
  //   disabled: true,
  // },
  {
    icon: <Power/>,
    route: '/settings/your-account/deactivate',
    label: 'Deactivate your account',
    description: 'Find out how you can deactivate your account'
  },
  {
    icon: <FileX/>,
    route: '/settings/your-account/delete',
    label: 'Delete your account',
    description: 'Find out how you can delete your account'
  }
]

export default function AccountPage() {
  return (
    <>
    <div className='w-full flex items-start flex-col md:hidden'>
    <AccountContent/>
    </div>
      <div className="w-full hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <AccountContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function AccountContent() {
  return(
    <SettingsCard
      name={'Your Account'}
      overview={'See information about your account, download an archive of your data, or learn about your account deactivation options'}
      options={yourAccountSettings}
    />
  )
}
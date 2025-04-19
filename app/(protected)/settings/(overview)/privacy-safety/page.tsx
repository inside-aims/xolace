import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsCard, SettingsOptionProps} from "@/components/settings/settings-card";
import {
  FileText,
  Eye,
} from "lucide-react";

const privacySafetyOptions: SettingsOptionProps[] = [
  // {
  //   icon: <Users />,
  //   label: 'Audience, media, and tagging',
  //   route: '/settings/privacy-safety/audience-tagging',
  //   description: "Manage what information you allow other people on Xolace to see ",
  // },
  {
    icon: <FileText />,
    label: 'Your posts',
    route: '/settings/privacy-safety/your-posts',
    description: 'Manage the information associated with your post',
  },
  {
    icon: <Eye />,
    label: 'Content you see',
    route: '/settings/privacy-safety/content-you-see',
    description: 'Decide what you see on Xolace, based on your preferences like Topic and interests',
  },
  // {
  //   icon: <ShieldOff />,
  //   label: 'Mute and block',
  //   route: '/settings/privacy-safety/mute-block',
  //   description: 'Manage the accounts, words, and notification that you have muted or blocked',
  //   disabled: true
  // },
];


export default function PrivacySafetyPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <PrivacySafetyContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <PrivacySafetyContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}
function PrivacySafetyContent() {
  return(
    <SettingsCard
      name={'Privacy and safety'}
      overview={'Manage what information you see and share on Xolace'}
      options={privacySafetyOptions}
    />
  )
}

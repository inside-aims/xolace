import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsCard, SettingsOptionProps} from "@/components/settings/settings-card";
import {
  Users,
  FileText,
  Eye,
  ShieldOff,
  Search,
} from "lucide-react";

const privacySafetyOptions: SettingsOptionProps[] = [
  {
    settingsKey: 'audienceTagging',
    icon: <Users />,
    label: 'Audience, media, and tagging',
    route: '/settings/privacy-safety/audience-tagging',
    description: "Manage what information you allow other people on Xolace to see ",
  },
  {
    settingsKey: 'your-posts',
    icon: <FileText />,
    label: 'Your posts',
    route: '/settings/privacy-safety/your-posts',
    description: 'Manage the information associated with your post',
  },
  {
    settingsKey: 'contentYouSee',
    icon: <Eye />,
    label: 'Content you see',
    route: '/settings/privacy-safety/content-you-see',
    description: 'Decide what you see on Xolace, based on your preferences like Topic and interests',
  },
  {
    settingsKey: 'muteAndBlock',
    icon: <ShieldOff />,
    label: 'Mute and block',
    route: '/settings/privacy-safety/mute-block',
    description: 'Manage the accounts, words, and notification that you have muted or blocked',
  },
  {
    settingsKey: 'discoverabilityAndContacts',
    icon: <Search />,
    label: 'Discoverability and contacts',
    route: '/settings/privacy-safety/discoverability-contacts',
    description: 'Control your discoverability settings and manage contacts you have imported',
  },
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
      cardKey={'privacy-safety'}
      name={'Privacy and safety'}
      overview={'Manage what information you see and share on Xolace'}
      options={privacySafetyOptions}
    />
  )
}

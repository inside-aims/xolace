import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsCard, SettingsOptionProps} from "@/components/settings/settings-card";
import { Shield, Smartphone } from "lucide-react";

const securityAccessOptions: SettingsOptionProps[] = [
  {
    icon: <Shield/>,
    label: 'Security',
    route: '/settings/security-access/security',
    description: "Manage your account's security",
    disabled: true,
  },
  {
    icon: <Smartphone />,
    label: 'Apps and sessions',
    route: '/settings/security-access/apps-sessions',
    description: "See information about when you logged into your account, and apps you connected to your account.",
    disabled: true,
  },
];

export default function SecurityAccessPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <SecurityAccessContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <SecurityAccessContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}
function SecurityAccessContent() {
  return(
    <SettingsCard
      name={'Security Access'}
      overview={'Manage what information you see and share on Xolace'}
      options={securityAccessOptions}
    />
  )
}

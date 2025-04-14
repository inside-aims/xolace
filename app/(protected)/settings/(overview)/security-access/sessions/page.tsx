import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsOptionProps} from "@/components/settings/settings-card";
import { Shield, Smartphone } from "lucide-react";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";

const securityAccessOptions: SettingsOptionProps[] = [
  {
    icon: <Shield/>,
    label: 'Security',
    route: '/settings/security-access/security',
    description: "Manage your account's security",
  },
  {
    icon: <Smartphone />,
    label: 'Apps and sessions',
    route: '/settings/security-access/apps-sessions',
    description: "See information about when you logged into your account, and apps you connected to your account.",
  },
];

export default function SessionsPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        < SessionsContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          < SessionsContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}
function  SessionsContent() {
  return(
    <SettingsNavigationWrapper title="Sessions">
      <div className={"px-4  w-full flex flex-col items-start gap-4"}>
        <h4 className={"w-full flex items-center font-semibold text-lg"}>
          Sessions
        </h4>
      </div>
    </SettingsNavigationWrapper>
  )
}

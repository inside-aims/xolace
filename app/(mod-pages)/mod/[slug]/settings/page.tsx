import ModsAndMembersTab from "@/components/mods/features/moderators/mods-and-members-tab";
import type {Metadata} from "next";
import SettingsTab from "@/components/mods/features/settings/settings-tab";

export const metadata: Metadata = {
  title: 'General Settings',
  description: "Manage campfire general settings"
};

const GeneralSettingsPage = () => {
  return (
    <main>
      <SettingsTab/>
    </main>
  );
};

export default GeneralSettingsPage;

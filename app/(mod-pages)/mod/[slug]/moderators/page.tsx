import ModsAndMembersTab from "@/components/mods/features/moderators/mods-and-members-tab";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Moderator',
  description: "Discover moderator tool for managing their campfire"
};

const ModsPage = () => {
  return (
    <main>
      <ModsAndMembersTab/>
    </main>
  );
};

export default ModsPage;

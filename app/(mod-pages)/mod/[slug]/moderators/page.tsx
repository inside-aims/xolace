import ModsAndMembersTab from "@/components/mods/features/moderators/mods-and-members-tab";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Moderator',
  description: "Discover different stories, experiences from real and unique individuals as well as the community"
};

const ModsPage = () => {
  return (
    <main>
      <ModsAndMembersTab/>
    </main>
  );
};

export default ModsPage;

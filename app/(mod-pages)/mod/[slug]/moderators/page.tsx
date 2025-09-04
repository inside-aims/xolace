import ModsAndMembersTab from "@/components/mods/features/moderators/mods-and-members-tab";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Moderator',
  description: "Discover moderator tool for managing their campfire"
};

interface Props {
  params: Promise<{ slug: string }>;
}

const ModsPage = async ({params}: Props) => {
  const { slug } = await params;

  return (
    <main>
      <ModsAndMembersTab slug={slug}/>
    </main>
  );
};

export default ModsPage;

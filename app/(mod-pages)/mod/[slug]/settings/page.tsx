import type {Metadata} from "next";
import SettingsTab from "@/components/mods/features/settings/settings-tab";

export const metadata: Metadata = {
  title: 'General Settings',
  description: "Manage campfire general settings"
};

// get slug params
interface Props {
  params: Promise<{ slug: string }>;
}

const GeneralSettingsPage = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    <main>
      <SettingsTab slug={slug}/>
    </main>
  );
};

export default GeneralSettingsPage;

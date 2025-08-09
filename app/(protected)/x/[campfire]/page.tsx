import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";
import React from "react";
import { Metadata } from "next";
import CampfireDetails from "@/components/campfires/campfire-details";

interface Props {
  params: Promise<{ campfire: string }>;
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_]/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { campfire } = await params;

  const pascalName = toPascalCase(campfire);

  return {
    title: `x${pascalName}`,
    description: `Join the ${pascalName} campfire — connect, share, and grow with like-minded people in a supportive circle.`,
  };
}


const CampfirePage = async ({ params }: Props) => {
  const { campfire } = await params;

  return (
    <main className="w-full flex items-center justify-center">
      <CampfireDetails/>
    </main>
  );
};
export default CampfirePage;

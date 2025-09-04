import React from 'react'
import type {Metadata} from "next";
import CampfireGuide from "@/components/mods/features/guide/campfire-guide";

export const metadata: Metadata = {
  title: 'Guide',
  description: "Manage your campfire guide"
};

interface Props {
  params: Promise<{ slug: string }>;
}


const GuidePage = async ({params}: Props) => {
  const { slug } = await params;

  return (
   <main>
     <CampfireGuide slug={slug}/>
   </main>
  )
}

export default GuidePage
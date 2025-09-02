import React from 'react'
import type {Metadata} from "next";
import CampfireGuide from "@/components/mods/features/guide/campfire-guide";

export const metadata: Metadata = {
  title: 'Guide',
  description: "Manage your campfire guide"
};


const GuidePage = () => {
  return (
   <main>
     <CampfireGuide/>
   </main>
  )
}

export default GuidePage
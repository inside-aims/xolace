import {Metadata} from "next";
import DiscoverCampfireList from "@/components/campfires/discover-campfire-list";


export const metadata: Metadata = {
  title: 'Campfires',
  description: "Join purpose-driven Campfires on Xolace—safe, focused spaces where members share stories, support one another, and grow together through shared challenges, goals, and creativity."
}

const CampfiresPage = () => {
  return(
    <main className="w-full">
      <DiscoverCampfireList/>
    </main>
  )
}
export default CampfiresPage;
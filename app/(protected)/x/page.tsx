import {Metadata} from "next";
import Campfire from "@/components/campfires/campfire";

export const metadata: Metadata = {
  title: 'Campfires',
  description: "Join purpose-driven Campfires on Xolace—safe, focused spaces where members share stories, support one another, and grow together through shared challenges, goals, and creativity."
}

const CampfiresPage = () => {
  return(
    <main>
      <Campfire/>
    </main>
  )
}
export default CampfiresPage;
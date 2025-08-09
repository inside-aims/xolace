import {Metadata} from "next";
import CampfiresList from "@/components/campfires/campfires-list";
import CampfiresListSkeleton from "@/components/campfires/campfires-list-skeleton";

export const metadata: Metadata = {
  title: 'Campfires',
  description: "Join purpose-driven Campfires on Xolace—safe, focused spaces where members share stories, support one another, and grow together through shared challenges, goals, and creativity."
}

const CampfiresPage = () => {
  return(
    <main>
      <CampfiresList/>
      {/*<CampfiresListSkeleton/>*/}
    </main>
  )
}
export default CampfiresPage;
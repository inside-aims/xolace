import {Metadata} from "next";
import ManageCampfireList from "@/components/campfires/manage-campfire-list";

export const metadata: Metadata = {
  title: 'Manage Campfires',
  description: "Join purpose-driven Campfires on Xolace—safe, focused spaces where members share stories, support one another, and grow together through shared challenges, goals, and creativity."
}

const ManageCampfiresPage = () => {
  return(
    <main className={"w-full"}>
      {/*for demonstration purpose*/}
      <ManageCampfireList/>
      {/*<CampfiresListSkeleton/>*/}
    </main>
  )
}
export default ManageCampfiresPage;
import VideoDetailsCard from "@/components/health-space/reflection/video-details-card";

interface Props{
  params: Promise<{ videoId: string }>;
}

export default async function VideoDetailsPage({ params }: Props)  {
  const { videoId } = await params;

  return(
    <main className={"w-full items-start p-4"}>
      <VideoDetailsCard/>
      {/*<section>*/}
      {/*  Video details pages*/}
      {/*  {videoId}*/}
      {/*</section>*/}
    </main>
  )
}

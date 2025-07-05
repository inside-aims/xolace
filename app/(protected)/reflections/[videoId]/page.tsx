import { VideoDetails } from "@/components/health-space/reflection/video-details";
import VideoDetailsCard from "@/components/health-space/reflection/video-details-card";
import { fetchBunnyVideoById } from "@/utils/bunny/bunny";

interface Props {
  params: Promise<{ videoId: string }>;
}

export default async function VideoDetailsPage({ params }: Props) {
  const { videoId } = await params;

  return (
      <VideoDetails videoId={videoId} />
  );
}

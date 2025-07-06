import { VideoDetails } from "@/components/health-space/reflection/video-details";

interface Props {
  params: Promise<{ videoId: string }>;
}

export default async function VideoDetailsPage({ params }: Props) {
  const { videoId } = await params;

  return (
      <VideoDetails videoId={videoId} />
  );
}

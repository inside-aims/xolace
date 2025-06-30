import VideoDetailsCard from "@/components/health-space/reflection/video-details-card";
import { fetchBunnyVideoById } from "@/utils/bunny/bunny";

interface Props {
  params: Promise<{ videoId: string }>;
}

export default async function VideoDetailsPage({ params }: Props) {
  const { videoId } = await params;

  const rawVideo = await fetchBunnyVideoById(videoId);

  console.log("Raw video", rawVideo);

  const video = {
    videoId: rawVideo.videoId,
    ownerId: rawVideo.accountId ?? "unknown",
    thumbnailUrl: rawVideo.thumbnailUrl ?? "",
    thumbnail: rawVideo.thumbnailFileName,
    title: rawVideo.title || 'Untitled',
    duration: Math.floor(rawVideo.length),
    userImg: "/assets/images/auth/sign-in.png",
    views: rawVideo.views || 0,
    username: 'FedeJnr',
    visibility: rawVideo.isPublic ? 'public' : 'private',
    createdAt: new Date(rawVideo.dateUploaded),
    description: rawVideo.videoDescription ?? "",
    category: rawVideo.category || "",
    totalWatchTime: rawVideo.totalWatchTime ?? 0,
    captions: rawVideo.captions || [],
    averageWatchTime: rawVideo.averageWatchTime ?? null,
    hasMP4Fallback: rawVideo.hasMP4Fallback ?? false,
    collectionId: rawVideo.collectionId ?? "",
    jitEncodingEnabled: rawVideo.jitEncodingEnabled ?? false,
    metaTags: rawVideo.metaTags ?? [],
    moments: rawVideo.moments ?? [],
    transcodingMessages: rawVideo.transcodingMessages ?? [],
  };

  return (
    <div className="w-full items-start p-4">
      <VideoDetailsCard video={video} key={videoId} videoId={videoId} />
    </div>
  );
}

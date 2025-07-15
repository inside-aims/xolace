import NotificationDetails from "@/components/notifications/notification-details";
import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ notificationId: string }>;
}

export default async function NotificationDetailsPage({ params }: Props) {
  const { notificationId } = await params;

  if (!notificationId){
    return notFound()
  }

  return (
    <HealthTipsWrapper>
      <NotificationDetails notificationId={notificationId} />
    </HealthTipsWrapper>
  );
}

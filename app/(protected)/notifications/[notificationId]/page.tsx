import NotificationDetails from "@/components/notifications/notification-details";
import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";

interface Props {
  params: Promise<{ notificationId: string }>;
}

export default async function NotificationDetailsPage({ params }: Props) {
  const { notificationId } = await params;

  return (
    <HealthTipsWrapper>
      <NotificationDetails notificationId={notificationId} />
    </HealthTipsWrapper>
  );
}

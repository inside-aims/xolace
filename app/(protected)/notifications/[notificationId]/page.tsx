import NotificationDetails from "@/components/notifications/notification-details";
import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

interface Props {
  params: Promise<{ notificationId: string }>;
}

export default async function NotificationDetailsPage({ params }: Props) {
  const { notificationId } = await params;
  const supabase = await createClient();

  if (!notificationId){
    return notFound()
  }

  const { data: notification, error } = await supabase.from('notifications').select('*').eq('id', notificationId).single();

  if (error || !notification) {
    return notFound();
  }

  return (
    <HealthTipsWrapper>
      <NotificationDetails notification={notification} />
    </HealthTipsWrapper>
  );
}

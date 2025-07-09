import React from 'react';
import type { Metadata } from 'next';
import HealthTipsWrapper from '@/components/shared/layoutUIs/HealthTipsWrapper';
import NotificationList from "@/components/notifications/notiication-list";
import {notifications} from "@/app/(protected)/notifications/(overview)/notifications";

export const metadata: Metadata = {
  title: 'Notifications',
  description:
    'Notification alert section',
};


const NotificationsPage = async () => {
  return (
    <HealthTipsWrapper>
      <main className='px-4'>
        <NotificationList notifications={notifications} />
      </main>
    </HealthTipsWrapper>
  );
};

export default NotificationsPage;

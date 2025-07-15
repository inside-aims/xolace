import React from 'react';
import type { Metadata } from 'next';
import HealthTipsWrapper from '@/components/shared/layoutUIs/HealthTipsWrapper';
import NotificationList from "@/components/notifications/notiication-list";

export const metadata: Metadata = {
  title: 'Notifications',
  description:
    'Notification alert section',
};


const NotificationsPage = async () => {
  return (
    <HealthTipsWrapper>
      <main className='px-4'>
        <NotificationList />
      </main>
    </HealthTipsWrapper>
  );
};

export default NotificationsPage;

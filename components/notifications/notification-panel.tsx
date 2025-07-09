'use client';

import { Settings } from 'lucide-react';
import NotificationPanelCard from "@/components/notifications/notification-panel-card";
import { NotificationProps } from "@/components/notifications/index";
import { useState } from "react";
import {useRouter} from "next/navigation";

const NotificationPanel = ({ notifications }: { notifications: NotificationProps[] }) => {
  const [filter, setFilter] = useState('allNotifications');
  const router = useRouter();

  const filteredNotifications = notifications.filter(n =>
    filter === 'important' ? n.important : true
  );

  const headerFilters = [
    { label: "Important", key: "important" },
    { label: "All Notifications", key: "allNotifications" },
  ] as const;

  const footerActions = [
    { label: "See all notifications", onClick: () => router.push("/notifications") },
    { label: "Mark all as read", onClick: () => console.log("Mark all read") },
  ];

  return (
    <div className="fixed top-[70px] left-1/2 transform -translate-x-1/2 w-[calc(100%-1rem)] max-w-[95%] md:left-auto md:right-4 md:translate-x-0 md:w-[320px] z-[9999] bg-white dark:bg-[#121212] shadow-lg border rounded-xl overflow-y-auto">
      <header className="flex flex-col gap-4 py-2 px-4">
        <aside className="flex items-center justify-between">
          <h3>Notification</h3>
          <Settings size={14} />
        </aside>

        <aside className="flex items-center justify-between  text-sm">
          { headerFilters.map(({ label, key }) => (
            <p
              key={key}
              onClick={() => setFilter(key)}
              className={`py-1 px-2 rounded-md cursor-pointer ${
                filter === key
                  ? "bg-lavender-500"
                  : "bg-neutral-200 dark:bg-neutral-800"
              }`}
            >
              { label }
            </p>
          ))}
        </aside>
      </header>

      <section className="bg-neutral-100 dark:bg-dark-1 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.slice(0,4).map((n) => (
            <NotificationPanelCard key={n.notificationId} {...n} />
          ))
        ) : (
          <div className="text-center text-sm text-gray-500 p-4">No notifications</div>
        )}
      </section>

      <footer className="py-2 px-4 flex items-center justify-between text-sm">
        {footerActions.map(({ label, onClick }) => (
          <p
            key={label}
            onClick={onClick}
            className="py-1 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer rounded-md"
          >
            {label}
          </p>
        ))}
      </footer>
    </div>
  );
};

export default NotificationPanel;

'use client';

import { Settings } from 'lucide-react';
import NotificationPanelCard from "@/components/notifications/notification-panel-card";
import { NotificationProps } from "@/components/notifications/index";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface NotificationPanelProps {
  notifications: NotificationProps[];
  isOpen: boolean;
}

const NotificationPanel = ({ notifications, isOpen }: NotificationPanelProps) => {
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
    <div
      className={`
        fixed top-[70px] right-0 w-[calc(100%-1rem)] max-w-[80%] md:w-[400px] h-[calc(100vh-70px)]
        z-[9999] bg-white dark:bg-[#121212] shadow-lg border rounded-lg
        flex flex-col overflow-hidden
        transition-transform duration-300
        ${isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}
      `}
    >
      <header className="flex flex-col gap-4 py-2 px-4">
        <aside className="flex items-center justify-between">
          <h3>Notification</h3>
          <Settings size={14} />
        </aside>

        <aside className="flex items-center justify-between text-sm">
          {headerFilters.map(({ label, key }) => (
            <p
              key={key}
              onClick={() => setFilter(key)}
              className={`py-1 px-2 rounded-md cursor-pointer ${
                filter === key
                  ? "bg-lavender-500"
                  : "bg-neutral-200 dark:bg-neutral-800"
              }`}
            >
              {label}
            </p>
          ))}
        </aside>
      </header>

      <section className="bg-neutral-100 dark:bg-dark-1 flex-1 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.slice(0, 8).map((n) => (
            <NotificationPanelCard key={n.notificationId} {...n} />
          ))
        ) : (
          <div className="text-center text-sm text-gray-500 p-4">No notifications</div>
        )}
      </section>

      <footer className="py-2 px-4 flex justify-between text-sm">
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

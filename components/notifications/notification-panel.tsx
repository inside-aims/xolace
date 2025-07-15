'use client';

import { Settings } from 'lucide-react';
import NotificationPanelCard from "@/components/notifications/notification-panel-card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePanelNotifications , useMarkAllNotificationsAsRead } from '@/hooks/notifications/useNotifications';
import { useUserState } from '@/lib/store/user';
import { Button } from "@/components/ui/button";
import SearchLoader from '../shared/loaders/SearchLoader';

// interface NotificationPanelProps {
//   isOpen: boolean;
// }

const NotificationPanel = () => {
  const [filter, setFilter] = useState<'all' | 'important'>('all');
  const router = useRouter();

  const { user } = useUserState();
  const { data: notifications, isLoading, error } = usePanelNotifications({ userId: user?.id, filter });
  const { mutate: markAllAsRead, isPending: isMarkingRead } = useMarkAllNotificationsAsRead();

  const headerFilters = [
    { label: "Important", key: "important" },
    { label: "All Notifications", key: "all" },
  ] as const;

  return (
    <div className="fixed top-[90px] right-0 w-[calc(100%-1rem)] max-w-[80%] md:w-[400px] h-auto max-h-[calc(100vh-160px)] md:max-h-[calc(100vh-100px)] z-[9999] bg-bg dark:bg-bg-dark shadow-lg border rounded-lg flex flex-col overflow-hidden ">
        <header className="flex flex-col gap-4 py-2 px-4 border-b">
            <aside className="flex items-center justify-between">
                <h3>Notification</h3>
                <Settings size={14} />
            </aside>
            <aside className="flex items-center justify-between text-sm">
                {headerFilters.map(({ label, key }) => (
                    <p
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`py-1 px-2 rounded-md cursor-pointer ${filter === key ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                        {label}
                    </p>
                ))}
            </aside>
        </header>

        <section className="flex-1 overflow-y-auto">
            {isLoading && <SearchLoader/>}
            {error && <p className="p-4 text-center text-red-500">Failed to load notifications.</p>}
            {!isLoading && !error && (
                notifications && notifications.length > 0 ? (
                    notifications.map((n) => (
                        <NotificationPanelCard key={n.id} notification={n} />
                    ))
                ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
                )
            )}
        </section>

        <footer className="py-2 px-4 flex justify-between text-sm border-t">
            <Button variant="link" onClick={() => router.push("/notifications")}>See all</Button>
            <Button variant="link" onClick={() => markAllAsRead()} disabled={isMarkingRead}>
                {isMarkingRead ? 'Marking...' : 'Mark all as read'}
            </Button>
        </footer>
    </div>
  );
};

export default NotificationPanel;

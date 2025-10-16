'use client';
import { CalendarDays, Video, Home, Plus, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItem {
  key: string;
  title: string;
  icon: React.ReactNode;
  route: string;
}

export const navItems: NavItem[] = [
  {
    key: 'home',
    title: 'Home',
    icon: <Home className="w-5 h-5" />,
    route: 'home',
  },
  {
    key: 'requests',
    title: 'Incoming Requests',
    icon: <Inbox className="w-5 h-5" />,
    route: 'requests',
  },
  {
    key: 'upcoming',
    title: 'Upcoming',
    icon: <CalendarDays className="w-5 h-5" />,
    route: 'upcoming',
  },
  {
    key: 'previous',
    title: 'Previous',
    icon: <CalendarDays className="w-5 h-5" />,
    route: 'previous',
  },
  {
    key: 'recordings',
    title: 'Recordings',
    icon: <Video className="w-5 h-5" />,
    route: 'recordings',
  },
  {
    key: 'personalRoom',
    title: 'Personal Room',
    icon: <Plus className="w-5 h-5" />,
    route: 'personalRoom',
  },
];

export const MentorIdleSidebar = ({
                                    activeRoute,
                                    onNavigate,
                                  }: {
  activeRoute: string;
  onNavigate: (route: string) => void;
}) => {
  return (
    <aside className="w-64 flex flex-col border-r border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800">
      {/* Header Section */}
      <div className="px-4 py-6 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Mentor Dashboard
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Manage your sessions
        </p>
      </div>

      {/* Navigation Section */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeRoute === item.route;

            return (
              <Button
                key={item.key}
                variant="ghost"
                className={`
                  w-full justify-start gap-3 h-11 px-3 
                  transition-all duration-200 rounded-lg
                  ${
                  isActive
                    ? 'bg-lavender-50 text-lavender-700 hover:bg-lavender-100 dark:bg-lavender-950 dark:text-lavender-300 dark:hover:bg-lavender-900 font-medium border-l-4 border-lavender-500 pl-2'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 border-l-4 border-transparent'
                }
                `}
                onClick={() => onNavigate(item.route)}
              >
                <span className={isActive ? 'text-lavender-600 dark:text-lavender-400' : ''}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.title}</span>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

    </aside>
  );
};
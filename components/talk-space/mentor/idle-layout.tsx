'use client';
import {CalendarDays, Video, Home, Plus} from 'lucide-react';
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

export const MentorIdleSidebar = ({ activeRoute, onNavigate }: {
  activeRoute: string;
  onNavigate: (route: string) => void;
}) => (
  <aside className="w-72 flex flex-col border-r bg-white shadow-sm text-neutral-700 dark:bg-neutral-800 dark:text-white">
    <div className="p-6 border-b  dark:border-neutral-800">
      <h2 className="text-xl font-bold">Mentor Office</h2>
      <p className="text-sm text-neutral-400 mt-1">Welcome back!</p>
    </div>

    <ScrollArea className="flex-1 px-3 py-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.key}
            variant={activeRoute === item.route ? "secondary" : "ghost"}
            className={`w-full justify-start gap-3 ${
              activeRoute === item.route
                ? ' bg-neutral-300 hover:bg-neutral-200 dark:bg-neutral-700'
                : 'hover:bg-neutral-200 dark:hover:bg-neutral-600'
            }`}
            onClick={() => onNavigate(item.route)}
          >
            {item.icon}
            <span>{item.title}</span>
          </Button>
        ))}
      </nav>
    </ScrollArea>

    <div className="p-4 border-t border-neutral-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
          M
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">Mentor User</p>
          <p className="text-xs text-neutral-400 truncate">mentor@example.com</p>
        </div>
      </div>
    </div>
  </aside>
);

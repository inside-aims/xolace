import {
  ClipboardList,
  Mail,
  Users,
  BarChart3,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { ComponentType } from "react";

export interface ModsSidebarLink {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  route: string;
  label: string;
  new?: boolean;
  lottieLink?: string;
  useLottieIcon?: boolean;
}

export interface ModsSidebarSection {
  title: string;
  items: ModsSidebarLink[];
}

export const getModsSidebarSections = (username?: string): ModsSidebarSection[] => {
  const parentRoute = username ? `/mod/${username}` : "/mod";

  return [
    {
      title: "OVERVIEW",
      items: [
        { icon: ClipboardList, route: `${parentRoute}/queues`, label: "Queues" },
        { icon: Mail, route: `${parentRoute}/mod-mail`, label: "Mod Mail" },
        { icon: Users, route: `${parentRoute}/moderators`, label: "Mods & Members", new: true },
        { icon: BarChart3, route:`${parentRoute}/insights`, label: "Insights" },
      ],
    },
    {
      title: "MODERATION",
      items: [
        { icon: BookOpen, route: `${parentRoute}/rules`, label: "Rules" },
        { icon: MessageSquare, route: `${parentRoute}/saved`, label: "Saved Responses" },
      ],
    },
  ];
};

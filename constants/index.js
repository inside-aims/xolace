import CreateIcon from "@/components/icons/CreateIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import { Rss, UserPen } from "lucide-react";

export const sidebarLinks = [
  {
    imgURL: <HomeIcon />,
    route: "/feed",
    label: "Home",
  },

  // {
  //   imgURL: "/assets/heart.svg",
  //   route: "/activity",
  //   label: "Activity",
  // },
  {
    imgURL: <CreateIcon />,
    route: "/create-post",
    label: "Create Post",
  },
  {
    imgURL: <UserPen />,
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: <Rss />,
    route: "/channel",
    label: "Channel",
  },
  // {
  //   imgURL: "/assets/community.svg",
  //   route: "/communities",
  //   label: "Communities",
  // },
];

export const navLinks = [
  {
    route: "/profile",
    label: "Profile",
  },
  {
    route: "/channel",
    label: "Channel",
  },
];

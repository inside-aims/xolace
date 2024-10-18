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

export const FORM_TYPES = {
  MAGIC_LINK: "magic-link",
  PASSWORD_LOGIN: "pw-login",
  PASSWORD_RECOVERY: "recovery",
};

export const postMoods = [
  {
    id: 1,
    label: "Neutral",
    value: "neutral",
    icon: "😐",
    color: "gray",
  },
  {
    id: 2,
    label: "Happy",
    value: "happy",
    icon: "😆",
    color: "green",
  },
  {
    id: 3,
    label: "Sad",
    value: "sad",
    icon: "🥹",
    color: "yellow",
  },
  {
    id: 4,
    label: "Angry",
    value: "angry",
    icon: "😠",
    color: "red",
  },
  {
    id: 5,
    label: "Confused",
    value: "confused",
    icon: "🫤",
    color: "orange",
  },
  // {
  //   id: 6,
  //   label: "Surprised",
  //   value: "surprised",
  //   icon: "😶‍🌫️",
  //   color: "blue",
  // },
];

import CreateIcon from "@/components/icons/CreateIcon";
import HomeIcon from "@/components/icons/HomeIcon";

export const sidebarLinks = [
  {
    imgURL: <HomeIcon />,
    route: "/feed",
    label: "Home",
  },
  // {
  //   imgURL: "/assets/search.svg",
  //   route: "/search",
  //   label: "Search",
  // },
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
  // {
  //   imgURL: "/assets/community.svg",
  //   route: "/communities",
  //   label: "Communities",
  // },
  // {
  //   imgURL: <HomeIcon />,
  //   route: "/profile",
  //   label: "Profile",
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

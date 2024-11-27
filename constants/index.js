
import HomeIcon from "@/components/icons/HomeIcon";
import { Rss, UserPen, MessageSquareDiff } from "lucide-react";

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
    imgURL: <MessageSquareDiff />,
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
    gif: "/assets/gifs/post-moods/sad-deactivate.gif"
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

// faqs
export const faqs = [
  {
    id: 1,
    question: "What is Xolace?",
    answer:
      "Xolace is an AI-powered social media platform that connects users with like-minded individuals. Our mission is to help people discover new friends, share ideas, and stay connected.",
  },
  {
    id: 2,
    question: "How do I create a post?",
    answer:
      "To create a post, simply type in your thoughts, select a mood and click submit.",
  },
  {
    id: 3,
    question: "What can I do as an anonymous user?",
    answer:
      " Basically you can do almost everything a normal user can ( such as like a post, create a post, comment etc), except changing your username and password ",
  },
  {
    id: 4,
    question:
      "Can I convert an anonymous user account to a permenant user account?",
    answer:
      "Currently no, but that is something the team is working really hard on",
  },
  {
    id: 5,
    question: "The post details page distorts when I try to comment, why?",
    answer:
      "Based the UI, there are some behaviours out of our control. So please pull the drawer up completely before commenting",
  },
  {
    id: 6,
    question: "Nothing seems touchable on the details page aside the drawer",
    answer:
      "Yes, since the drawer is meant to stay on the page , it ultimately affects the focus of the UI. Our team is working hard to find the best solution",
  },
];

import HomeIcon from '@/components/icons/HomeIcon';
import {
  Rss,
  UserPen,
  MessageSquareDiff,
  Zap,
  ThumbsUp,
  Flame,
  Clock,
  Bomb, Eclipse, Key , GlobeLock, Copyright, LibraryBig,
} from 'lucide-react';

export const sidebarLinks = [
  {
    icon: <HomeIcon />,
    route: '/feed',
    label: 'Home',
  },

  // {
  //   imgURL: "/assets/heart.svg",
  //   route: "/activity",
  //   label: "Activity",
  // },
  {
    icon: <MessageSquareDiff />,
    route: '/create-post',
    label: 'Create Post',
  },
  {
    icon: <UserPen />,
    route: '/profile',
    label: 'Profile',
  },
  {
    icon: <Bomb size={22} strokeWidth={1.75} />,
    route: '/explore',
    label: 'Explore',
  },
  {
    icon: <Rss />,
    route: '/channel',
    label: 'Channel',
  },
  {
    icon: <LibraryBig />,
    route: '/collections',
    label: 'Collections',
  },
  // {
  //   imgURL: "/assets/community.svg",
  //   route: "/communities",
  //   label: "Communities",
  // },
];

export const aboutLeftSideLinks = [
  {
    imgURL: <Eclipse />,
    route: '/about/general',
    label: 'About Xolace',
  },
  {
    imgURL: <Key />,
    route: '/about/terms',
    label: 'Terms',
  },
  {
    imgURL: <GlobeLock />,
    route: '/about/privacy',
    label: 'Privacy',
  },
  {
    imgURL: <Copyright />,
    route: '/about/credits',
    label: 'Credits & Licenses',
  },
]

export const navLinks = [
  {
    route: '/profile',
    label: 'Profile',
  },
  {
    route: '/channel',
    label: 'Channel',
  },
  {
    route: '/explore',
    label: 'Explore',
  },
  {
    route: '/collections',
    label: 'Collections',
  },
];

export const FORM_TYPES = {
  MAGIC_LINK: 'magic-link',
  PASSWORD_LOGIN: 'pw-login',
  PASSWORD_RECOVERY: 'recovery',
};

export const postMoods = [
  {
    id: 1,
    label: 'Neutral',
    value: 'neutral',
    icon: '😐',
    color: 'gray',
  },
  {
    id: 2,
    label: 'Happy',
    value: 'happy',
    icon: '😆',
    color: 'green',
  },
  {
    id: 3,
    label: 'Sad',
    value: 'sad',
    icon: '🥹',
    color: 'yellow',
    gif: '/assets/gifs/post-moods/sad-deactivate.gif',
  },
  {
    id: 4,
    label: 'Angry',
    value: 'angry',
    icon: '😠',
    color: 'red',
    gif: '/assets/gifs/post-moods/angry-unscreen.gif',
  },
  {
    id: 5,
    label: 'Confused',
    value: 'confused',
    icon: '🫤',
    color: 'orange',
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
    question: 'What is Xolace?',
    answer:
      'Xolace is an AI-powered social media platform that connects users with like-minded individuals. Our mission is to help people discover new friends, share ideas, and stay connected.',
  },
  {
    id: 2,
    question: 'How do I create a post?',
    answer:
      'To create a post, simply type in your thoughts, select a mood and click submit.',
  },
  {
    id: 3,
    question: 'What can I do as an anonymous user?',
    answer:
      ' Basically you can do almost everything a normal user can ( such as like a post, create a post, comment etc), except changing your username and password ',
  },
  {
    id: 4,
    question:
      'Can I convert an anonymous user account to a permenant user account?',
    answer:
      'Currently no, but that is something the team is working really hard on',
  },
  {
    id: 5,
    question: 'The post details page distorts when I try to comment, why?',
    answer:
      'Based the UI, there are some behaviours out of our control. So please pull the drawer up completely before commenting',
  },
  {
    id: 6,
    question: 'Nothing seems touchable on the details page aside the drawer',
    answer:
      'Yes, since the drawer is meant to stay on the page , it ultimately affects the focus of the UI. Our team is working hard to find the best solution',
  },
];

export const getMoodLabelStyle = mood => {
  console.log(mood);
  switch (mood) {
    case 'neutral':
      return ' !text-pink-500 !dark:text-pink-400 ';
    case 'happy':
      return 'text-green-500 dark:text-green-400';
    case 'sad':
      return 'text-blue';
    case 'angry':
      return 'text-red-500 dark:text-red-400 ';
    case 'confused':
      return 'text-yellow-500 dark:text-yellow-400';
    default:
      return 'text-zinc-500 dark:text-zinc-100';
  }
};

export const filters = [
  { name: 'trending', label: 'Trending', icon: <Zap size={16} /> },
  { name: 'popular', label: 'Popular', icon: <ThumbsUp size={16} /> },
  { name: 'controversial', label: 'Spicy', icon: <Flame size={16} /> },
  { name: 'recent', label: 'Fresh', icon: <Clock size={16} /> },
];

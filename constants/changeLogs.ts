
export interface UpdateLog {
  version: string
  date: string
  title: string
  changes: string[]
  type?: "major" | "minor" | "patch"
  status?: "released" | "upcoming"
}

export const updates: UpdateLog[] = [
  {
    version: '1.0',
    date: 'February 1, 2025',
    title: 'We just started',
    type: "major",
    status: "released",
    changes: [
      '**Core Features**',
      '- 🎭 Anonymous posting: Share thoughts without an account!',
      '- ⏳ Expiring posts: Set posts to vanish after 24 hours.',
      '- ⬆️⬇️ Vote system: Upvote/downvote posts ',
      '- 💬 Commenting: Join discussions on any post.',
      '- 🚨 Reporting: Flag inappropriate content with severity levels.',
      '- 📌 Collections: Save posts to favorites for later.',
      "**User Experience**",
      "- 🏷️ Tagging: Add topics like #MentalHealth or #Tech to posts.",
      "- 😊 Mood tagging: Mark posts as Happy, Sad, Neutral, etc.",
      "**Technical Improvements**",
      "- 🔒 Row-Level Security (RLS): Full data protection for anonymous/normal users.",
      "- ⚡ Real-time updates: Instant sync for comments",
    ],
  },
  // log new ui update and activities feature and performance improvements
  {
    version: '1.1',
    date: 'February 25, 2025',
    title: 'New UI and Activities Feature',
    type: "minor",
    status: "released",
    changes: [
      '**New UI**',
      '- 🎨 New design: A fresh, modern look for a better user experience.',
      '- 📚 Activities: View your activity history and manage your collections.',
      '**Performance Improvements**',
      '- 🚀 Faster loading: Optimize data fetching and caching.',
      '- 🔄 Improved performance: Streamline operations for faster responses.',
    ],
  },

  // log new settings page and preferences
  {
    version: '1.2',
    date: 'May 4, 2025',
    type: "major",
    status: "released",
    title: 'New Settings Page and Preferences',
    changes: [
      '**New Settings Page**',
      '- 🛠️ New design: A fresh, modern look for settings page.',
      '- 📲 Preferences: Manage your preferences for sensitive content, privacy, and more.',
      '- 🚪 Privacy Safety: Manage your privacy and safety settings.',
      '- 🧩 Your Account: Manage your account information, change password, and more.',
    ],
  },
  {
    version: '2.0',
    date: 'June 5, 2025',
    type: "major",
    status: "released",
    title: 'Xolace Phase Two',
    changes: [
      '**Platform Enhancements**',
      '- 🏠 Landing page overhaul: Clear vision, mission, and how-to-use guide with CTA and contact support.',
      '- 🔐 Authentication pages: Fully refactored for accessibility and mobile responsiveness.',
      '- 🎉 Welcome toast: Animated greeting for early users.',
      '**Settings & Account**',
      '- ⚙️ Robust account settings: Organized into Account, Privacy & Anonymity, Security & Trust, Help Center.',
      '**Wellness & Engagement**',
      '- 🧘 Wellness Insights: Tips for mental and physical health.',
      '- 🔖 Profile stats: Engagement badges, top tags, and post previews.',
      '- 📅 Daily prompts: Streak-based, gamified participation system.',
      '**User Experience**',
      '- 🟢 Online status: Avatars show who’s active in real time.',
      '- 📱 Feed optimization: Smoother content feed, mobile-friendly, accessibility-focused.',
      '- 🐱 Meet Flex: Xolace’s new friendly mascot!',
    ],
  },
  {
    version: '2.1',
    date: 'June 25, 2025',
    type: "major",
    status: "released",
    title: 'Introducing Aniima AI chatbot',
    changes: [
      '**Release of Aniima AI chatbot BETA**',
      '- 🛠️ design: Intrusively designed chat interface ',
      '- 📲 AI : Aniima AI is your AI companion to help you navigate your thoughts and feelings.',
    ],
  },
  {
    version: "3.0",
    date: "July 15, 2025",
    title: "Community Features",
    type: "major",
    status: "upcoming",
    changes: [
      "**Community Hub**",
      "- 👥 Group discussions: Create and join topic-based discussion groups.",
      "- 🏆 Achievement system: Earn badges for wellness milestones.",
      "- 📊 Community insights: View aggregated wellness trends.",
    ],
  },
  {
    version: '2.2',
    date: 'June 26, 2025',
    type: "patch",
    status: "released",
    title: 'Bug fixes & Delete account functionality',
    changes: [
      '**Bug fixes & Delete account functionality**',
      '- 🛠️ Fixed layout distortion at the post details page ',
      '- ❌ Delete account functionality available now ',
    ],
  },
];

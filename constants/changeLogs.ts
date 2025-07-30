
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
  {
    version: '2.3',
    date: 'July 19, 2025',
    title: 'Introducing Glimpse: Your New Source of Perspective',
    type: "major",
    status: "released",
    changes: [
      '**Glimpse Video Feature**',
      '- ✨ Glimpse: Watch short, inspiring videos from mentors, therapists, and counselors on Xolace.',
      '- 🌍 Real stories: Gain perspective through authentic experiences and grounded mental health advice.',
      '- 🧠 Mental wellness boost: Daily doses of support to help you feel seen and centered.',
      '**Contributor Access**',
      '- 🧑‍⚕️ Verified voices: Video creation is currently limited to verified mentors and professionals to maintain a safe space.',
      '- 📩 Want to contribute? Reach out to our support team—we’d love to hear your story.',
      '**Looking Ahead**',
      '- 🚀 Expansion plans: Video sharing may open to all users soon—stay tuned!',
    ]
  },
  {
    version: '2.4',
    date: 'July 28, 2025',
    title: 'New Feature Alert: Anonymous Messages Just Got Real',
    type: "major",
    status: "released",
    changes: [
      '**Anonymous Message Links**',
      '- 🔗 Share a unique link and receive anonymous messages from friends or complete strangers.',
      '- 💌 From confessions to compliments, now’s your time to hear it all raw and real.',
      '- 👻 Their identity stays hidden. Yours stays safe. Always.',
      '**Complete Customization**',
      '- 🎨 You control the design, prompt wording, and message vibe people see when they click your link.',
      '- ✍️ Create different themes for different moods.',
      '**Freedom to Reply or Ignore**',
      '- 🚫 Not feeling a message? No pressure. No one will know.',
    ]
  }
  
];

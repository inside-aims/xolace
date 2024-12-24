export const generateMockPosts = (count: number) => {
  const moods = [
    { emoji: "😊", style: " bg-green-500 dark:bg-green-900", name: "happy" },
    { emoji: "😢", style: "bg-blue dark:bg-blue", name: "sad" },
    { emoji: "😠", style: "bg-red-500 dark:bg-red-900", name: "angry" },
    {
      emoji: "🤔",
      style: "bg-secondary-500 dark:bg-yellow-900",
      name: "confused",
    },
    { emoji: "😐", style: "bg-gray-200 dark:bg-gray-9gi00", name: "neutral" },
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 1}`,
    author_name: `User ${i + 1}`,
    author_avatar_url: `/placeholder.svg?height=40&width=40`,
    content: `This is a sample post content for post number ${i + 1}. It can be quite long and might need truncation in the UI.`,
    timestamp: `${Math.floor(Math.random() * 24)}h ago`,
    mood: moods[Math.floor(Math.random() * moods.length)],
    expires_in_24hr: Math.random() > 0.5,
    upvotes: Math.floor(Math.random() * 1000),
    downvotes: Math.floor(Math.random() * 500),
    comments: Math.floor(Math.random() * 100),
  }));
};

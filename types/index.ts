export * from "./post"

export type Mood = {
    id: number
    label: string
    value: string
    icon: string
    color: string
    gif?: string
  }

  // Map mood to emoji and button style
export const moodMap: Record<string, { emoji: string; style: string; gif?: string }> =
{
  neutral: { emoji: "😐", style: "border-pink-600 bg-transparent" },
  happy: { emoji: "😆", style: "border-green-500 bg-green-400" },
  sad: {
    emoji: "🥹",
    style: "border-blue bg-blue-400",
    gif: "/assets/gifs/post-moods/sad-deactivate.gif",
  },
  angry: { emoji: "😠", style: "border-red-500 bg-red-400" },
  confused: { emoji: "🫤", style: "border-yellow-500 bg-yellow-400" },
};
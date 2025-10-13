'use client';

import {ChevronRight} from "lucide-react";
import {useRouter} from 'next/navigation';

export const ActionButton = () => {
  const router = useRouter();

  const actionButtons = [
    {
      label: 'Chat with a Therapist',
      key: 'chat_therapist',
      route: '/chat/therapist',
    },
    {
      label: 'Chat Live with a Mentor',
      key: 'chat_mentor',
      route: '/chat/mentor',
    },
    {
      label: 'Chat with a Counselor',
      key: 'chat_counselor',
      route: '/talk-space/counselor',
    },
    {
      label: 'Browse Mentors',
      key: 'mentors',
      route: '/talk-space/mentors',
    },
  ];

  return (
    <div>
      { actionButtons.map((action) => (
        <button
          key={action.key}
          onClick={() => router.push(action.route)}
          className="w-full group overflow-hidden rounded-2xl p-4 border transition-all duration-300 hover:shadow-lg text-left hover:border-lavender-500">
          <div className="flex items-center justify-between relative z-10">
            <span className="font-medium text-sm group-hover:text-neutral-700 transition-colors">
              {action.label}
            </span>
            <ChevronRight
              className="w-5 h-5 text-gray-400 group-hover:text-lavender-500 group-hover:translate-x-1 transition-all flex-shrink-0 "
            />
          </div>
        </button>
      ))}
    </div>
  )
}

export function ChatCard({title, description}: { title: string; description: string; }) {
  return (
    <div className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 border`}
    >
      <h3 className="font-semibold text-sm mb-1 group-hover:text-neutral-700 transition-colors">
        {title}
      </h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">{description}</p>
    </div>
  );
}

export function QuickLink({emoji, text}: { emoji: string; text: string }) {
  return (
    <div
      className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-700 cursor-pointer transition-colors">
      <span className="text-lg">{emoji}</span>
      <span>{text}</span>
    </div>
  );
}

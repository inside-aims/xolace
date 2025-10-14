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


interface ActionCardProps {
  label: string;
}

export function ActionCard({ label }: ActionCardProps) {
  return (
    <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
      {label}
    </button>
  );
}


const QuickAction = () => {
  return (
    <aside className="w-full lg:w-80 bg-white/80 dark:bg-background shadow-lg p-4 lg:p-6 space-y-3 overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
        Quick Actions
      </h3>
      <ActionButton/>
      <div
        className="mt-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-5 border border-purple-200">
        <h4 className="font-bold text-sm mb-3 text-purple-900">
          Quick Links
        </h4>
        <div className="space-y-2.5">
          <QuickLink emoji="🧠" text="Mental Health Resources"/>
          <QuickLink emoji="❤️" text="How to Talk Safely Online"/>
          <QuickLink emoji="📘" text="Community Guidelines"/>
        </div>
      </div>

      <div className="mt-4 bg-white dark:bg-dark-2 rounded-lg p-4 border">
        <p className="text-xs italic text-center">
          {"You're not alone. We're here to listen and support you."}
        </p>
      </div>
    </aside>
  )
}
export default QuickAction


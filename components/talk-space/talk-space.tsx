'use client';

import { useState } from 'react';
import { MessageSquareMore, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ChatItem = {
  title: string;
  description: string;
  offer?: boolean;
};

type CampfireItem = {
  title: string;
  description: string;
};

const chatList: ChatItem[] = [
  {
    title: 'Limited Time Offer: 25% Off Therapy',
    description: 'Use Code: 25OFF7C',
    offer: true,
  },
  {
    title: 'Noni (emotional support)',
    description: 'Feeling stuck? Sometimes life gets hard...',
  },
];

const campfireList: CampfireItem[] = [
  {
    title: 'Anxiety Support Group',
    description: 'Join people managing anxiety together.',
  },
  {
    title: 'Growth & Mindset',
    description: 'Talk about habits, focus, and life direction.',
  },
];

const actionButtons = [
  'Chat with a Therapist',
  'Chat Live with a Mentor',
  'Chat with a counselor',
  'Browse Mentors',
];

export default function MentalHealthChat() {
  const [activeTab, setActiveTab] = useState<'chats' | 'campfires'>('chats');
  const displayList = activeTab === 'chats' ? chatList : campfireList;

  return (
    <div
      className="flex flex-col lg:flex-row w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

      <aside className="w-full lg:w-80 bg-white/80 dark:bg-background shadow-lg flex flex-col lg:max-h-screen relative">
        <div className="p-4 lg:p-6 flex-shrink-0">
          <div className="relative">
            <Input
              placeholder="Search conversations..."
              className="pl-10 rounded-2xl border-gray-200 shadow-sm"
            />
            <MessageSquareMore className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
          </div>
        </div>

        <div className="px-4 lg:px-6 mb-4 flex-shrink-0">
          <div className="flex gap-2 border rounded-full">
            {['chats', 'campfires'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-2.5 px-4 text-sm font-semibold capitalize rounded-full transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-400 to-lavender-600 shadow-lg hover:shadow-xl text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(tab as 'chats' | 'campfires')}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2 min-h-0 pb-4">
          {displayList.map((item, idx) => (
            <ChatCard key={idx} title={item.title} description={item.description}/>
          ))}
        </div>

        <div className="hidden lg:block absolute bottom-14 left-0 w-full p-4 ">
          <div
            className="rounded-2xl p-4 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border "
            onClick={() => ''}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Considering Therapy?</p>
                <p className="text-xs mt-0.5 text-neutral-400">
                  Talk to an expert therapist
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500"/>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden p-6 min-h-[400px] lg:min-h-screen">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-300/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="bg-gradient-to-br from-purple-400 to-lavender-600 p-6 rounded-2xl shadow-lg mb-6">
            <MessageSquareMore
              className="w-8 h-8 lg:w-14 lg:h-14 text-white"
              strokeWidth={1.5}
            />
          </div>
          <h2
            className="text-2xl lg:text-3xl font-bold mb-3 bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent"> Start
            Your Journey </h2>
          <p className="text-gray-600 mb-6 max-w-md text-sm lg:text-base">
            Select a conversation or start a new one to connect with support
          </p>
          <Button
            className="rounded-full px-6 lg:px-8 py-5 lg:py-6 text-sm lg:text-base font-semibold bg-gradient-to-r from-purple-400 to-lavender-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Select a Conversation
          </Button>
        </div>
      </main>

      <aside className="w-full lg:w-80 bg-white/80 dark:bg-background shadow-lg p-4 lg:p-6 space-y-3 overflow-y-auto">

        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          Quick Actions
        </h3>
        {actionButtons.map((label, idx) => (
          <ActionButton
            key={idx}
            label={label}
          />
        ))}

        <div className="mt-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-5 border border-purple-200">
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
    </div>
  );
}

function ChatCard({title, description}: { title: string; description: string; }) {
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

function ActionButton({label}: { label: string }) {
  return (
    <button
      className="w-full group overflow-hidden rounded-2xl p-4 border transition-all duration-300 hover:shadow-lg text-left">
      <div className="flex items-center justify-between relative z-10">
        <span className="font-medium text-sm group-hover:text-neutral-700 transition-colors">
          {label}
        </span>
        <ChevronRight
          className="w-5 h-5 text-gray-400 group-hover:text-neutral-600 group-hover:translate-x-1 transition-all flex-shrink-0"/>
      </div>
    </button>
  );
}

function QuickLink({emoji, text}: { emoji: string; text: string }) {
  return (
    <div
      className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-700 cursor-pointer transition-colors">
      <span className="text-lg">{emoji}</span>
      <span>{text}</span>
    </div>
  );
}
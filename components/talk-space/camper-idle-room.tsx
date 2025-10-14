'use client';

import {ChevronRight, MessageSquareMore} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import QuickAction, {ChatCard} from "@/components/talk-space/mentor/action-links";
import {useState} from "react";

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


const CamperIdleRoom = ({onSelectProfessional}: {onSelectProfessional: () => void}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'campfires'>('chats');
  const displayList = activeTab === 'chats' ? chatList : campfireList;

  return (
    <div
    className={`flex flex-col lg:flex-row w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50`}>
    <aside
      className="w-full lg:w-80 bg-white/80 dark:bg-background shadow-lg flex flex-col lg:max-h-screen relative">
      <div className="p-4 lg:p-6 flex-shrink-0">
        <div className="relative">
          <Input
            placeholder="Search conversations..."
            className="pl-10 rounded-2xl border-gray-200 shadow-sm"
          />
          <MessageSquareMore
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          />
        </div>
      </div>

      <div className="px-4 lg:px-6 mb-4 flex-shrink-0">
        <div className="flex gap-2 border rounded-full">
          {['chats', 'campfires'].map((tab) => (
            <button key={tab}
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
          <ChatCard
            key={idx}
            title={item.title}
            description={item.description}
          />
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

    {/*call room*/}
    <main
      className="flex-1 flex flex-col items-center justify-center relative overflow-hidden p-6 min-h-[400px] lg:min-h-screen">
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
          onClick={onSelectProfessional}
        >
          Select a Conversation
        </Button>
      </div>
    </main>
    <QuickAction/>
  </div>
  )
}

export default CamperIdleRoom;
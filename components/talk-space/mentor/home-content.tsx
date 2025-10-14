'use client';

import {CalendarDays, FolderOpen, UserPlus, Video} from "lucide-react";
import React, {useState} from "react";
import ViewModal from "@/components/talk-space/mentor/view-modal";

type actionKeys = "startSession" | "joinSession" | "scheduleSession" | "recordings";

interface ActionProps {
  key: actionKeys;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
  isNav?: boolean;
}


const actions: ActionProps[] = [
  {
    key: "startSession",
    title: 'Start Session',
    description: 'Instantly connect with your camper',
    icon: <Video className="w-6 h-6" />,
    color: 'bg-orange-500',
  },
  {
    key: "joinSession",
    title: 'Join Session',
    description: 'Use session code or invite link',
    icon: <UserPlus className="w-6 h-6" />,
    color: 'bg-blue-500',
  },
  {
    key: "scheduleSession",
    title: 'Schedule Session',
    description: 'Plan and manage future sessions',
    icon: <CalendarDays className="w-6 h-6" />,
    color: 'bg-purple-500',
  },
  {
    key: "recordings",
    title: 'View Records',
    description: 'Access previous session notes',
    icon: <FolderOpen className="w-6 h-6" />,
    color: 'bg-yellow-500',
    isNav: true,
  },
];

const HomeContent = ({  onNavigate }: { onNavigate: (route: string) => void; }) => {
  const [openModal, setOpenModal] = useState<actionKeys | null>(null);


  const date = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

  const handleCardAction = (key: actionKeys) => {
    if (key === "recordings") return onNavigate("recordings");
    setOpenModal(key);
  };


  return (
    <>
      <div className="flex flex-col gap-8 min-h-screen">
        <div
          className="bg-white shadow-sm border text-neutral-700 dark:bg-neutral-800 dark:text-white rounded-2xl p-4 flex-1 items-start justify-center flex flex-col gap-8">
          <p className="inline-block rounded-lg px-4 py-2 bg-neutral-300 dark:bg-neutral-700 text-sm font-medium mb-6">
            Upcoming meeting at 12:30pm
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-6xl font-bold">{time}</p>
            <p className="text-xl font-semibold text-neutral-500">{date}</p>
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((card) => (
            <ActionCard
              key={card.key}
              title={card.title}
              description={card.description}
              icon={card.icon}
              color={card.color}
              onClick={() => handleCardAction(card.key)}
            />
          ))}
        </section>
      </div>
      {openModal === "scheduleSession" && (
        <ViewModal
          drawerOpen
          setDrawerOpen={() => setOpenModal(null)}
          title={"Schedule a session"}
        >
          <div>Schedule session</div>
        </ViewModal>
      )}
      {openModal === "joinSession" && (
        <ViewModal
          drawerOpen
          setDrawerOpen={() => setOpenModal(null)}
          title={"Join a session"}
        >
          <div>Join session</div>
        </ViewModal>
      )}
      {openModal === "startSession" && (
        <ViewModal
          drawerOpen
          setDrawerOpen={() => setOpenModal(null)}
          title={"Start Session"}
        >
          <div>Start session</div>
        </ViewModal>
      )}
    </>
  );
}

export default HomeContent;

const ActionCard = ({title, description, onClick, icon, color}: ActionProps) => {
  return (
    <div
      className={`${color} rounded-2xl p-6 flex flex-col justify-between h-60 shadow-md hover:scale-105 transition-transform cursor-pointer text-white`}
      onClick={onClick}>
      <div className="bg-white/20 p-3 rounded-lg w-fit">{icon}</div>
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </div>
  );
};

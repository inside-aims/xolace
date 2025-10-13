'use client';

import { CalendarDays, Video, UserPlus, FolderOpen } from 'lucide-react';
interface ActionProps {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const actions: ActionProps[] = [
  {
    key: "startSession",
    title: 'Start Session',
    description: 'Instantly connect with your mentee',
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
    key: "viewRecords",
    title: 'View Records',
    description: 'Access previous session notes',
    icon: <FolderOpen className="w-6 h-6" />,
    color: 'bg-yellow-500',
  },
];

const MentorIdleRoom = () => {

  const date = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:bg-foreground">
      <Sidebar />

      <main className="flex flex-col justify-between  my-8 ms-8 p-4 gap-8">
        <div className={"flex bg-neutral-800 flex-1 flex-col justify-evenly rounded-2xl p-6"}>
          <p className={"rounded-sm p-2 bg-neutral-500"}>
            Upcoming meeting at 12:30pm
          </p>
          <div className="flex flex-col leading-tight gap-2 p-2">
            <p className="text-5xl font-bold">{time}</p>
            <p className="font-semibold text-neutral-400">{date}</p>
          </div>
        </div>

        {/* Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((card) => (
            <ActionCard
              key={card.key}
              title={card.title}
             description={card.description}
             icon={card.icon}
             color={card.color}
             onClick={card.onClick}
            />
          ))}
        </section>
      </main>
    </div>
  );
};
export default MentorIdleRoom;

const Sidebar = () => (
  <aside className="w-72 flex flex-col gap-3 bg-neutral-800 border-r py-8 px-4">
   <div>
     hey
   </div>
  </aside>
);


const ActionCard = ({title, description, onClick, icon, color}: ActionProps) => {
  return (
    <div className={`${color} rounded-2xl p-6 flex flex-col justify-between h-62 shadow-md hover:scale-[1.02] transition-transform cursor-pointer text-white`}
      onClick={onClick && onClick}>
      <div className="bg-white/20 p-2 rounded-lg w-fit">{icon}</div>
      <div className={"fle flex-col"}>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm opacity-80">{description}</p>
      </div>
    </div>
  )
}

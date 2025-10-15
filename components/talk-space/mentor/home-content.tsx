'use client';

import {CalendarDays, FolderOpen, UserPlus, Video} from "lucide-react";
import React, {useState} from "react";
import ViewModal from "@/components/talk-space/mentor/view-modal";
import {CallButton} from "@/components/talk-space/mentor/call-room-layout";
import {useTalkSpaceStore} from "@/hooks/talkSpace/useTalkSpaceStore";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Calendar} from "@/components/ui/calendar"
import {format} from "date-fns"
import {useForm, Controller} from "react-hook-form";


type ScheduleSessionData = {
  description: string;
  date: Date;
};

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
    icon: <Video className="w-6 h-6"/>,
    color: 'bg-orange-500',
  },
  {
    key: "joinSession",
    title: 'Join Session',
    description: 'Use session code or invite link',
    icon: <UserPlus className="w-6 h-6"/>,
    color: 'bg-blue-500',
  },
  {
    key: "scheduleSession",
    title: 'Schedule Session',
    description: 'Plan and manage future sessions',
    icon: <CalendarDays className="w-6 h-6"/>,
    color: 'bg-purple-500',
  },
  {
    key: "recordings",
    title: 'View Records',
    description: 'Access previous session notes',
    icon: <FolderOpen className="w-6 h-6"/>,
    color: 'bg-yellow-500',
    isNav: true,
  },
];

const HomeContent = ({onNavigate}: { onNavigate: (route: string) => void; }) => {
  const [openModal, setOpenModal] = useState<actionKeys | null>(null);
  const {callStatus, setMentor, setCallStatus, resetCall} = useTalkSpaceStore();

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

  // Helper for Mentor start a session
  const handleStartSession = () => {
    setCallStatus("in-call")
  }

  // Helper for mentor join a session
  const handleJoinSession = () => {
    setCallStatus("in-call")
  }

  // Helper form for Mentor schedule a session
  const handleScheduleSession = () => {
  }


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
          title={"Arrange a Session with a Camper"}
        >
          <ScheduleSessionForm onSubmit={handleScheduleSession}/>
        </ViewModal>
      )}
      {openModal === "joinSession" && (
        <ViewModal
          drawerOpen
          setDrawerOpen={() => setOpenModal(null)}
          title={"Quickly join a session"}
        >
          <JoinSession onSubmit={handleJoinSession}/>
        </ViewModal>
      )}
      {openModal === "startSession" && (
        <ViewModal
          drawerOpen
          setDrawerOpen={() => setOpenModal(null)}
          title={"Start a New Session"}
        >
          <StartSession onStart={handleStartSession}/>
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

const ScheduleSessionForm = (
  {onSubmit,}: { onSubmit: (data: ScheduleSessionData) => void; }) => {
  const {handleSubmit, control, register} = useForm<ScheduleSessionData>();
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div>
          <Label>Session Description</Label>
          <Textarea
            className={"border border-neutral-400"}
            placeholder="Describe your upcoming session..."
            {...register("description", {required: true})}
          />
        </div>

        <div>
          <Label>Select Date and Time</Label>
          <Controller
            name="date"
            control={control}
            rules={{required: true}}
            render={({field}) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Input
                    value={selectedDate ? format(selectedDate, "PPP") : ""}
                    placeholder="Pick a date"
                    readOnly
                    className="border border-neutral-400 cursor-pointer"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      field.onChange(date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
      </div>
      <CallButton
        label="Schedule Session"
        onStartAction={handleSubmit(onSubmit)}
        size="default"
      />
    </form>
  );
};


const JoinSession = ({onSubmit}: { onSubmit: () => void }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <Label className={""}>Enter Session Link</Label>
        <Input
          placeholder="Paste your session link here"
          className="border border-neutral-400"
        />
      </div>
      <CallButton
        label="Join Session"
        onStartAction={onSubmit}
        size="default"
      />
    </div>
  );
};


const StartSession = ({onStart}: { onStart: () => void }) => {
  return (
    <div className="py-4 w-full flex">
      <CallButton
        label="Start Session"
        onStartAction={onStart}
        size="lg"/>
    </div>
  );
};


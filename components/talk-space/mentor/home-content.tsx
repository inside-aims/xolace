'use client';

import {CalendarDays, FolderOpen, UserPlus, Video} from "lucide-react";
import React, {useState} from "react";
import ViewModal from "@/components/talk-space/mentor/view-modal";
import {CallButton} from "@/components/talk-space/mentor/call-room-layout";
import {useTalkSpaceStore} from "@/hooks/talkSpace/useTalkSpaceStore";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Calendar} from "@/components/ui/calendar"
import {useForm} from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import {z} from "zod";


const scheduleSessionSchema = z.object({
  description: z.string().min(10, 'Please provide more details about the session.'),
  date: z.date({ required_error: 'Please select a session date.' }),
});

const joinSessionSchema = z.object({
  sessionLink: z.string()
    .url("Please enter a valid session link (starting with https://)")
    .min(10, "Session link cannot be empty."),
});

export type JoinSessionData = z.infer<typeof joinSessionSchema>;
export type ScheduleSessionData = z.infer<typeof scheduleSessionSchema>;

interface ScheduleSessionFormProps {
  onSubmit: (data: ScheduleSessionData) => void;
}


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


export const JoinSession = ({ onSubmit }: { onSubmit: (data: JoinSessionData) => void }) => {
  const form = useForm<JoinSessionData>({
    resolver: zodResolver(joinSessionSchema),
    defaultValues: { sessionLink: "" },
  });

  const handleSubmit = (data: JoinSessionData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="sessionLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="Paste your session link here"
                  className="border border-neutral-400"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CallButton
          type="submit"
          label="Join Session"
          onStartAction={form.handleSubmit(handleSubmit)}
          size="default"
        />
      </form>
    </Form>
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


const ScheduleSessionForm = ({ onSubmit }: ScheduleSessionFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const form = useForm<ScheduleSessionData>({
    resolver: zodResolver(scheduleSessionSchema),
    defaultValues: {
      description: '',
      date: undefined,
    },
  });

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const isValidDate = (date: Date | undefined) => {
    if (!date) return false;
    return !isNaN(date.getTime());
  };

  const handleSubmit = (values: ScheduleSessionData) => {
    toast.success('Session scheduled successfully!');
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form className="w-full flex flex-col gap-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your upcoming session..."
                  className="border border-neutral-400"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Date & Time</FormLabel>
              <FormControl>
                <div className="relative flex gap-2">
                  <Input
                    value={inputValue}
                    placeholder="Pick a date"
                    className="border border-neutral-400 cursor-pointer "
                    onClick={() => setOpen(true)}
                    readOnly
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setInputValue(e.target.value);
                      if (isValidDate(date)) {
                        setSelectedDate(date);
                        setMonth(date);
                        field.onChange(date);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setOpen(true);
                      }
                    }}
                  />
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <div className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
                        <CalendarDays/>
                        <span className="sr-only">Select date</span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full flex p-0 overflow-hidden"
                      align="end"
                      alignOffset={-8}
                      sideOffset={10}
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        month={month}
                        onMonthChange={setMonth}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setInputValue(formatDate(date));
                          field.onChange(date);
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CallButton
          type="submit"
          label="Schedule Session"
          onStartAction={form.handleSubmit(handleSubmit)}
          size="default"
        />
      </form>
    </Form>
  );
};


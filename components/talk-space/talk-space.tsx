'use client';

import {useEffect, useState} from 'react';
import {ActionButton} from "@/components/talk-space/mentor/action-links";
import CamperIdleRoom from "@/components/talk-space/camper-idle-room";
import {useTalkSpaceStore} from "@/hooks/talkSpace/useTalkSpaceStore";
import {useSearchParams} from "next/navigation";
import { mentors } from './mentor/mentors-listings';
import ViewModal from "@/components/talk-space/mentor/view-modal";
import CallRoom from "@/components/talk-space/call-room";
import MentorIdleRoom from "@/components/talk-space/mentor-idle-room";

export default function MentalHealthChat() {

  const [isProfessionalModalOpen, setIsProfessionalModalOpen] = useState<boolean>(false);

  const params = useSearchParams();
  const mentorId = params.get('mentorId');
  console.log(mentorId);
  const { callStatus, setMentor, setCallStatus } = useTalkSpaceStore();

  useEffect(() => {
    if (!mentorId) {
      setCallStatus('idle');
      setMentor(undefined);
      return;
    }
    const selectedMentor = mentors.find((m) => m.id === mentorId);

    if (selectedMentor) {
      setMentor(selectedMentor);
    }
  }, [mentorId, setCallStatus, setMentor]);


  const { mentor } = useTalkSpaceStore();


  return (
    <div className="flex flex-col h-screen w-full">
      {/*idle page for mentor and camper - that's empty space. */}
      {(callStatus === 'idle' || callStatus == "ended") && (
        // To see camper idle room, comment <MentorIdleRoom/> and uncomment <CamperIdleRoom/>

        // <CamperIdleRoom
        //   onSelectProfessional={() => setIsProfessionalModalOpen(true)}
        // />

        <MentorIdleRoom/>
      )}
      {callStatus === "in-call" && (
        <CallRoom onEndASessionAction={() => setCallStatus("ended")}/>
      )}
      {(mentor && callStatus === "requesting") && (
        <div className={"text-black"}>
          {`We're connecting you to mentor ${mentor.name}`}
        </div>
      )}

      {isProfessionalModalOpen && (
        <ViewModal
          drawerOpen={isProfessionalModalOpen}
          setDrawerOpen={setIsProfessionalModalOpen}
          title={"Select a conversation"}>
          <ActionButton/>
        </ViewModal>
      )}
    </div>
  );
}

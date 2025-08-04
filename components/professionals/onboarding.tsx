'use client';


import React from "react";
import {IdleState} from "@/components/professionals/states/IdleState";
import {ProceedingState} from "@/components/professionals/states/ProceedingState";
import StartingState from "@/components/professionals/states/StartingState";
import {FinishedState} from "@/components/professionals/states/FinishedState";

export type OnboardingState = "idle" | "proceeding" | "starting" | "finished";

const ProfessionalsOnboarding = () => {
  const [state, setState] = React.useState<OnboardingState>("idle");

  const handleJoinCircle = () => {
    setState("proceeding");
    setTimeout(() => setState("starting"), 5000);
  }

  return (
    <div className={`w-full flex flex-col items-center justify-center dark:bg-bg-dark bg-bg text-foreground min-h-screen gap-2 md:px-0 ${state !== "starting" && ("px-2 md:px-0")}`}>
      {state === "idle" && <IdleState onJoinCircle={handleJoinCircle}/>}
      {state === "proceeding" && <ProceedingState/>}
      {state === "starting" && <StartingState />}
      {state === "finished" && <FinishedState/>}
    </div>
  )
}
export default ProfessionalsOnboarding;


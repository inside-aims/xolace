import {ReactNode} from "react";
import HealthTips from "@/components/shared/HealthTips";

/*
Wrapper class to display health tips only on
desktop device. It takes children component
 */
export default function HealthTipsWrapper({children}: {children: ReactNode})  {
  return (
    <div className={"w-full grid grid-cols-12"}>
      <div
        className="px-0! pt-8 pb-12 sm:container min-h-full md:h-screen overflow-auto col-span-12 md:col-span-8">
        {children}
      </div>
      <div className={"border-s mt-1 col-span-12 md:col-span-4 hidden md:flex h-screen overflow-auto"}>
       <HealthTips/>
      </div>
    </div>
  )
}
import {ReactNode} from "react";
import HealthTips from "@/components/shared/HealthTips";
import HealthTipsSkeleton from "@/components/shared/loaders/HealthTipsSkeleton"; // Import the skeleton

/*
Wrapper class to display health tips only on
desktop device. It takes children component
 */
export default function HealthTipsWrapper({children, isLoading}: {children: ReactNode, isLoading?: boolean})  {
  return (
    <div className={"w-full grid grid-cols-12 md:h-[calc(100vh-var(--header-height))]"}>
      <div
        className="px-0! pt-8 pb-12 sm:container overflow-auto col-span-12 md:col-span-8">
        {children}
      </div>
      <div className={"pt-1 col-span-12 md:col-span-4 hidden md:flex h-full overflow-auto"}>
       {isLoading ? <HealthTipsSkeleton /> : <HealthTips/>}
      </div>
    </div>
  )
}
import { ReactNode } from 'react';
import CampfirePurposes from "@/components/campfires/campfire-purposes";

/*
Wrapper class to display campfire only on
desktop device. It takes children component
 */
export default function CampfireWrapper({children}: {
  children: ReactNode;
  isLoading?: boolean;
}) {
  return (
    <div
      className={
        'grid w-full grid-cols-12 h-[calc(100vh-var(--header-height))]'
      }
    >
      <div
        id="feed-scroll-container"
        className="col-span-12 overflow-auto px-0! pt-8 pb-12 sm:container md:col-span-9"
      >
        {children}
      </div>
      <div
        className={
          'col-span-12 hidden h-full overflow-auto pt-1 md:col-span-3 md:flex border'
        }
      >
        <CampfirePurposes/>
      </div>
    </div>
  );
}

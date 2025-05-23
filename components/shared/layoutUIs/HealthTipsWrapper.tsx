import { ReactNode } from 'react';
import HealthTips from '@/components/shared/HealthTips';
import HealthTipsSkeleton from '@/components/shared/loaders/HealthTipsSkeleton'; // Import the skeleton

/*
Wrapper class to display health tips only on
desktop device. It takes children component
 */
export default function HealthTipsWrapper({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading?: boolean;
}) {
  return (
    <div
      className={
        'grid w-full grid-cols-12 md:h-[calc(100vh-var(--header-height))]'
      }
    >
      <div className="col-span-12 overflow-auto px-0! pt-8 pb-12 sm:container md:col-span-8">
        {children}
      </div>
      <div
        className={
          'col-span-12 hidden h-full overflow-auto pt-1 md:col-span-4 md:flex'
        }
      >
        {isLoading ? <HealthTipsSkeleton /> : <HealthTips />}
      </div>
    </div>
  );
}

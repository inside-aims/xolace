
import {Skeleton} from "@/components/ui/skeleton";

// Loading skeleton component
const CampfireAboutSkeleton = () => (
    <div className="flex items-start flex-col py-4 gap-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
      <div className="flex items-start flex-col gap-4 px-4 py-2 w-full">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-8 w-full rounded-full" />
        <div className="flex justify-between w-full">
          <Skeleton className="h-12 w-16" />
          <Skeleton className="h-12 w-16" />
          <Skeleton className="h-12 w-16" />
        </div>
      </div>
    </div>
  );

export default CampfireAboutSkeleton;
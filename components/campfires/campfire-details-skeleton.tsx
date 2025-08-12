import { Skeleton } from "@/components/ui/skeleton";


// Loading skeleton component
const CampfireDetailsSkeleton = () => (
    <div className="flex w-full flex-col items-center justify-center max-w-5xl mt-1">
      <Skeleton className="w-full h-[128px] rounded-none md:rounded-lg" />
      
      <div className="w-full flex flex-col gap-4 md:gap-0 md:flex-row items-start md:items-center justify-between px-4 mt-4">
        <div className="flex flex-row gap-4 items-center">
          <Skeleton className="w-16 h-16 rounded-full md:hidden" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 md:hidden" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
  
      <div className="hidden w-full md:grid grid-cols-12 gap-4 p-4 mt-4">
        <div className="col-span-8">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
        <div className="col-span-4">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
  
  export default CampfireDetailsSkeleton;
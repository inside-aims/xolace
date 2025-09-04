import { useEffect, useState } from "react";
import { fetchTags } from "@/app/actions";
import { Tag } from "@/types/global";
import { toast } from "sonner";

export function TopTags() {

  // states
  const [postTags , setPostTags ] = useState<Tag[]>([])
  const [ isLoading , setIsLoading ] = useState<boolean>(true)

useEffect(()=>{
const loadTags = async () =>{
  try {
    const data = await fetchTags();
  if(data){
    setPostTags(data)
  }
  } catch (_) {
    toast.error("Failed to fetch tags. Please refresh the page.");
  } finally {
    setIsLoading(false)}
}

loadTags()
},[])

  return(
    <>
      <div className="w-full flex flex-col gap-4 mx-4 md:mx-0">
        <h3 className="font-semibold text-xl hidden md:flex">
          {isLoading ? (
            <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ) : (
            "Top Tags"
          )}
        </h3>
        <div className="flex flex-wrap gap-3">
          {isLoading ? (
            // Loading skeleton for tags
            Array(6).fill(0).map((_, index) => {
              const widths = ['w-16', 'w-24', 'w-20', 'w-28', 'w-22', 'w-18'];
              const colors = [
                'bg-moss-200/50 dark:bg-moss-800/30',
                'bg-ocean-200/50 dark:bg-ocean-800/30',
                'bg-lavender-200/50 dark:bg-lavender-800/30'
              ];
              
              return (
                <div
                  key={`skeleton-${index}`}
                  className={`relative pr-6 pl-3 py-1 border border-gray-200 dark:border-gray-700 rounded-full flex items-center gap-2 ${widths[index % widths.length]} ${colors[index % colors.length]} animate-pulse`}
                >
                  <div className="h-4 flex-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-3 w-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <span
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-400 dark:bg-gray-500"
                  ></span>
                </div>
              );
            })
          ) : (
            postTags.map((tag) => {
              let tagStyle;
              let holeColor;

              if (tag.post >= 10) {
                tagStyle = 'bg-moss-300 text-moss-900 border-moss-900';
                holeColor = 'bg-moss-900';
              } else if (tag.post >= 5) {
                tagStyle = 'bg-ocean-300 text-ocean-900 border-ocean-900';
                holeColor = 'bg-ocean-900';
              } else {
                tagStyle = 'bg-lavender-300 text-lavender-900 border-lavender-900';
                holeColor = 'bg-lavender-950';
              }

              return (
                <div
                  key={tag.name}
                  className={`relative pr-6 pl-3 py-1 border rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:shadow-md hover:cursor-wait ${tagStyle}`}
                >
                  <span className="capitalize">{tag.name}</span>
                  <span className="text-xs font-semibold opacity-70">[{tag.post}]</span>
                  <span
                    className={`absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-white shadow-inner ${holeColor}`}
                  ></span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  )
}
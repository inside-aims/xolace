"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { formUrlQuery, removeKeyFromQuery } from "@/lib/url";

import { Input } from "@/components/ui/input";

interface LocalSearchPropsInterface {
  route: string;
  imgSrc?: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearch = ({
  route,
  imgSrc,
  placeholder,
  otherClasses,
}: LocalSearchPropsInterface) => {
  const pathname = usePathname()
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState<string>(query);

  useEffect(() => {
    // debounce search querying for a few seconds
    const delayDebounceFn = setTimeout(() =>{
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });
  
        router.push(newUrl, {
          scroll: false,
        });
      }else{
          console.log("empty")
          if(pathname === route){
            // if searchQuery is totally empty
            const newUrl = removeKeyFromQuery({
                params: searchParams.toString(),
                keysToRemove: ["query"]
            })
            router.push(newUrl, {
                scroll: false,
              });
          }
  
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, router, route, searchParams, pathname]);

  return (
    <div className={`relative w-full max-w-md mx-auto ${otherClasses}`}>
    <Input
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-10 pr-4 py-2 w-full outline-none no-focus"
    />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
  </div>
  );
};

export default LocalSearch;

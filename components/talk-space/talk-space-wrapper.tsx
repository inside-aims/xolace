'use client';

import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {useRouter} from "next/navigation";
import React from "react";

const TalkSpaceWrapper = ({children}: {children: React.ReactNode}) => {
  const router = useRouter();

  return(
    <div className="min-h-screen flex w-full flex-col gap-2 px-4 sm:px-6 lg:px-8">
      <div className="flex items-start justify-start pt-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-10 h-10 border border-neutral-400 transition-all duration-150 hover:scale-105 shadow-sm"
          onClick={() => router.back()}
        >
          <ArrowLeft size={18}/>
        </Button>
      </div>
      <div className={"mt-2"}>
        {children}
      </div>
    </div>
  )
}
export default TalkSpaceWrapper
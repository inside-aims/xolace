'use client';

import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";

const SharedHeader = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="w-full">
      <section className="w-full">
        <p><small>Public library</small></p>
        <div className="flex items-center justify-between w-full" style={{ margin: "0" }}>
          <h3 className="font-semibold text-2xl">All Videos</h3>
        </div>
      </section>

      {/*search filtering section*/}
      <section className={"w-full flex items-center justify-between"}>
        <div className="relative w-full md:w-[50%] mt-4">
           <span className="absolute inset-y-0 start-0 flex items-center ps-4">
             <Search className="w-4 h-4 text-muted-foreground"/>
           </span>
          <Input
            type="text"
            name="searchInput"
            placeholder="Search for videos here"
            className="rounded-full py-4 ps-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className={"rounded-2xl border px-6 py-1"}>
          Most recent
        </button>
      </section>
    </header>
  )
}
export default SharedHeader;
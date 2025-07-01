'use client';

import {ChevronDown, Search, Upload} from "lucide-react";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import VideoUploadForms from "@/components/health-space/reflection/video-upload-form";


interface SharedHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const SharedHeader: React.FC<SharedHeaderProps> = ({searchTerm, onSearchChange, currentFilter, onFilterChange,}) => {
  const [open, setOpen] = useState<boolean>(false);

  const filters = [
    { key: "all", label: "All" },
    { key: "mostRecent", label: "Most Recent" },
    { key: "mostLikes", label: "Most likes" },
    { key: "mostViews", label: "Most Views" },
  ];

  return (
    <>
      <header className="w-full items-center">
        <section className="w-full">
          <p><small>Public library</small></p>
          <div className="flex items-center justify-between w-full">
            <h3 className="font-semibold text-2xl">All Videos</h3>
            <Button
              className={"flex flex-row items-center gap-2 border rounded-2xl px-4 h-9 bg-lavender-500 hover:bg-lavender-600 text-white transition-transform duration-300 ease-in-out hover:scale-110"}
              onClick={() => setOpen(true)}
            >
              <span><Upload className={"h-4 w-4"}/></span>
              Upload a video
            </Button>
          </div>
        </section>

        <section className="w-full flex items-center justify-between gap-4 mt-4">
          <div className="relative w-full md:w-[50%]">
          <span className="absolute inset-y-0 start-0 flex items-center ps-4">
            <Search className="w-4 h-4 text-muted-foreground"/>
          </span>
            <Input
              type="text"
              name="searchInput"
              placeholder="Search for videos here"
              className="rounded-full ps-10 h-9"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center border rounded-full whitespace-nowrap px-4 h-9">
                {filters.find((f) => f.key === currentFilter)?.label || "All"}
                <ChevronDown className="ml-2 h-4 w-4"/>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {filters.map((filter) => (
                <DropdownMenuItem
                  key={filter.key}
                  onClick={() => onFilterChange(filter.key)}
                  className={currentFilter === filter.key ? "bg-accent" : ""}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      </header>
      <VideoUploadForms open={open} setOpen={setOpen}/>
    </>
  );
};

export default SharedHeader;

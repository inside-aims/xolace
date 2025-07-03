'use client';

import { ChevronDown, Search, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import VideoUploadForms from "./video-upload-form";
import { filterOptions } from "@/constants";

// Define the props the component will receive
interface SharedHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const SharedHeader: React.FC<SharedHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState(searchQuery);

  // Debounce the search input
  useEffect(() => {
    if (inputValue !== searchQuery) {
      const debounceTimer = setTimeout(() => {
        onSearchChange(inputValue);
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [inputValue, onSearchChange, searchQuery]);

  // Find the label for the currently selected filter key
  const selectedFilterLabel = filterOptions.find(f => f.key === selectedFilter)?.label || "Most Recent";

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
              <Search className="w-4 h-4 text-muted-foreground" />
            </span>
            <Input
              type="text"
              placeholder="Search for videos here"
              className="rounded-full ps-10 h-9"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center border rounded-full whitespace-nowrap px-4 h-9">
                {selectedFilterLabel}
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {filterOptions.map((filter) => (
                <DropdownMenuItem
                  key={filter.key}
                  onClick={() => onFilterChange(filter.key)}
                  className={selectedFilter === filter.key ? "bg-lavender-300" : ""}
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

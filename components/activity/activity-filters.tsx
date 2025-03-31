"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface ActivityFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export function ActivityFilters({ currentFilter, onFilterChange }: ActivityFiltersProps) {
  const filters = [
    { value: "all", label: "All Activities" },
    { value: "posts", label: "Posts" },
    { value: "comments", label: "Comments" },
    { value: "views", label: "Views" },
    { value: "votes", label: "Votes" },
  ];

  const currentLabel = filters.find(f => f.value === currentFilter)?.label || "All Activities";

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-medium">Recent Activity</h2>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {currentLabel}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {filters.map((filter) => (
            <DropdownMenuItem
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={currentFilter === filter.value ? "bg-accent" : ""}
            >
              {filter.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
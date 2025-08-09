"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { CampfirePurpose } from "@/components/campfires/campfires.types";

const purposes = Object.values(CampfirePurpose);

interface FilterByPurposeProps {
  selected: CampfirePurpose[];
  onChange: (values: CampfirePurpose[]) => void;
}

export function FilterByPurpose({ selected, onChange }: FilterByPurposeProps) {

  const handleToggle = (purpose: CampfirePurpose) => {
    if (selected.includes(purpose)) {
      onChange(selected.filter(p => p !== purpose));
    } else {
      onChange([...selected, purpose]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 rounded-e-2xl">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden md:flex">Filter by purpose</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 md:w-[var(--radix-popover-trigger-width)]  mx-1 md:mx-0">
        <Command>
          <CommandEmpty>No purposes found.</CommandEmpty>
          <CommandGroup heading="Select Purposes">
            {purposes.map((purpose) => (
              <CommandItem
                key={purpose}
                onSelect={() => handleToggle(purpose)}
                className="flex items-center justify-start gap-2"
              >
                <Checkbox
                  checked={selected.includes(purpose)}
                  onCheckedChange={() => handleToggle(purpose)}
                />
                <span>{purpose}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

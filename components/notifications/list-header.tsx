import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import React from "react";

interface ListHeaderProps {
  filterOptions: {key: string; label: string}[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const ListHeader: React.FC<ListHeaderProps> = ({filterOptions, selectedFilter, onFilterChange}) => {

  return(
    <header className="w-full rounded-lg items-start flex flex-col gap-2 md:gap-4 shadow-lg p-4 border ">
      <section>
        <h2 className={"font-semibold text-xl"}>Notifications center</h2>
      </section>
      <section className={"hidden flex-row gap-4 md:flex"}>
        {filterOptions.map((option) => (
          <button
            key={option.key}
            className={`py-0.5 px-2 rounded-md hover:animate-pulse text-sm capitalize ${selectedFilter === option.key ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            onClick={() => onFilterChange(option.key)}
          >
            { option.label }
          </button>
        ))}
      </section>

      <section className={"w-full flex md:hidden items-center justify-between"}>
        <div/>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center border rounded-full whitespace-nowrap px-4 h-9 capitalize">
              {selectedFilter}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {filterOptions.map((filter) => (
              <DropdownMenuItem
                key={filter.key}
                onClick={() => onFilterChange(filter.key)}
                className={selectedFilter === filter.key ? "bg-primary text-primary-foreground" : ""}
              >
                {filter.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </header>
  )
}
export default ListHeader;
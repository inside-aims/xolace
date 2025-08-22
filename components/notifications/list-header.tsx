import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ChevronDown, Trash} from "lucide-react";
import React from "react";
import { DefaultLoader } from "../shared/loaders/DefaultLoader";

interface ListHeaderProps {
  filterOptions: {key: string; label: string}[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  onDeleteAll: () => void;
  isDeleteAllPending: boolean;
  notificationsCount: number;
}

const ListHeader: React.FC<ListHeaderProps> = ({filterOptions, selectedFilter, onFilterChange, onDeleteAll, isDeleteAllPending, notificationsCount}) => {

  return(
    <header className="w-full rounded-lg items-start flex flex-col gap-2 md:gap-4 shadow-lg p-4 border ">
      <section>
        <h2 className={"font-semibold text-xl"}>Notifications center</h2>
      </section>
      <section className="w-full hidden md:flex items-center justify-between">
        <div className="flex flex-row gap-4">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              className={`py-0.5 px-2 rounded-md hover:animate-pulse text-sm capitalize ${
                selectedFilter === option.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
              onClick={() => onFilterChange(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          className={`py-0.5 px-2 flex items-center justify-center  rounded-md hover:animate-pulse text-sm capitalize text-white bg-red-500 ${isDeleteAllPending || notificationsCount === 0 ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={onDeleteAll}
          type="button"
          disabled={isDeleteAllPending || notificationsCount === 0}
        >
         {isDeleteAllPending ? <DefaultLoader size={16} /> : ( <span className="flex flex-row items-center justify-center gap-1"><Trash size={14}/> Delete All</span>)}
        </button>
      </section>

      <section className={"w-full flex md:hidden items-center justify-between"}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center border rounded-full whitespace-nowrap px-4 h-9 capitalize">
              {selectedFilter}
              <ChevronDown className="ml-2 h-4 w-4"/>
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
        <button
          className={`py-0.5 px-2 flex flex-row items-center justify-center gap-1 rounded-md hover:animate-pulse text-sm capitalize text-white bg-red-500 ${isDeleteAllPending || notificationsCount === 0 ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={onDeleteAll}
          type="button"
          disabled={isDeleteAllPending || notificationsCount === 0}
        >
          {isDeleteAllPending ? <DefaultLoader size={16} /> : ( <span className="flex flex-row items-center justify-center gap-1"><Trash size={14}/> Delete All</span>)}
        </button>
      </section>
    </header>
  )
}
export default ListHeader;
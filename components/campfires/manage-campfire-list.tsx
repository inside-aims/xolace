"use client";

import { Input } from "@/components/ui/input";
import React, { useCallback, useState } from "react";
import { useAllPublicCampfires } from "@/queries/campfires/getAllPublicCampfires";
import { useUserState } from "@/lib/store/user";
import { Folders, SquareDashedMousePointer } from "lucide-react";
import ManageCampfireCard from "@/components/campfires/manage-cards";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";

const tabOptions: { key: string; label: string }[] = [
  { key: "allCampfires", label: "All Campfires" },
  { key: "favorites", label: "Favorites" },
];

// Dummy data for testing favorite display
const communities = [
  {
    campfireId: "one",
    slug: "hey there",
    name: "r/southafrica",
    description: "Ike e: /xarra //ke",
    iconUrl: "/icons/southafrica.png",
    isFavorite: true,
  },
  {
    campfireId: "two",
    slug: "hey there",
    name: "r/StockMarket",
    description:
      "Welcome to /r/StockMarket! Our objective is to provide short and mid term trade ideas...",
    iconUrl: "/icons/stockmarket.png",
  },
];

const ManageCampfireList = () => {
  const user = useUserState((state) => state.user);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("allCampfires");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    data: campfires,
    isPending,
    isError,
    refetch,
  } = useAllPublicCampfires(user?.id);


  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
  }, []);

  const filteredCampfires = communities.filter((option) => {
    const matchesSearch =
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedTab === "allCampfires" ||
      (selectedTab === "favorites" && option.isFavorite);

    return matchesSearch && matchesFilter;
  });

  const handleSelectedTab = (key: string) => {
    setSelectedTab(key);
  };

  // Helper for adding to favorite
  const handleAddToFavorite = (campfireId: string) => {
    console.log(campfireId)
  }

  return (
    <div className="flex w-full items-start justify-center h-[calc(100vh-var(--header-height))]">
      <div className="flex flex-col gap-4 w-full items-start justify-start pt-4 md:pt-8 px-4 max-w-5xl">
        <h1 className="text-2xl font-bold">Manage Campfire</h1>
        <div className="w-full grid grid-cols-12 gap-4 md:gap-8 md:space-x-8">
          <div className="flex flex-col gap-4 w-full col-span-12 md:col-span-8">

            <div className="w-full flex items-center justify-between gap-4">
              <div className="flex w-full items-center border dark:border-neutral-200 rounded-lg h-10 px-2">
                <Folders className="text-muted-foreground  h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by name or keyword"
                  className="w-full border border-x-0 dark:border-neutral-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <button className="flex items-center md:hidden rounded-full bg-slate-100 dark:bg-slate-800 px-4 p-2">
                    <SquareDashedMousePointer />
                  </button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Select Filter</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col gap-2 p-4">
                    {tabOptions.map((option) => {
                      const active = option.key === selectedTab;
                      return (
                        <button
                          key={option.key}
                          className={`p-2 h-10 rounded-lg text-neutral-600 dark:text-neutral-100 text-sm  text-left ${active ? "bg-slate-100 font-semibold dark:bg-neutral-700":"hover:bg-slate-50"}`}
                          onClick={() => {
                            handleSelectedTab(option.key)
                            setDrawerOpen(false)
                          }}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            <Separator className="flex md:hidden" />

            <div className="w-full flex flex-col gap-4">
              {filteredCampfires.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center w-full">
                  <div className="text-6xl mb-4">🔥</div>
                  <h3 className="text-lg font-medium mb-2">No campfires found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try adjusting your search or filters"
                      : "Be the first to create a campfire!"
                    }
                  </p>
                  {searchTerm && (
                    <Button onClick={handleClearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                filteredCampfires.map((c, i) => (
                  <ManageCampfireCard
                    key={i}
                    {...c}
                    onAddToFavorite={() => handleAddToFavorite(c.campfireId)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex w-full col-span-2 md:col-span-4 items-start">
            <div className="hidden md:flex flex-col w-full items-start">
              {tabOptions.map((option) => {
                const active = option.key === selectedTab;
                return (
                  <button
                    key={option.key}
                    className={`p-2 h-10 rounded-lg text-neutral-600 dark:text-neutral-100 text-sm flex w-full items-start ${active ? "bg-slate-100 font-semibold dark:bg-neutral-700" : "hover:bg-slate-50 dark:hover:bg-neutral-900 rounded-lg "}`}
                    onClick={() => handleSelectedTab(option.key)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCampfireList;

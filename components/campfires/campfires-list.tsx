'use client';

import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, {useState} from "react";
import {CampfirePurpose} from "@/components/campfires/campfires.types";
import CampfireCard from "@/components/campfires/campfire-card";
import {FilterByPurpose} from "@/components/campfires/filtered-purpose";

export interface CampfiresProps {
  campfireId: string;
  name: string;
  description: string;
  members: number;
  purpose: CampfirePurpose;
  iconURL?: string;
  isMember: boolean;
}

// Dummy list of campfires - would be replaced with real data from db
const campfires: CampfiresProps[] = [
  {
    campfireId: "1",
    name: "x/AnxietyAllies",
    description: "Provide support actively in a diverse circle of understanding friends.",
    members: 145,
    purpose: CampfirePurpose.Growth,
    iconURL: "/assets/images/mas.webp",
    isMember: false,
  },
  {
    campfireId: "2",
    name: "x/CreativeCorner",
    description: "A safe place to share your art, writing, and creative projects.",
    members: 212,
    purpose: CampfirePurpose.Creative,
    isMember: true
  },
  {
    campfireId: "3",
    name: "x/SupportSquad",
    description: "Listening, caring, and uplifting each other every day.",
    members: 98002,
    purpose: CampfirePurpose.Support,
    isMember: false,
  },
  {
    campfireId: "4",
    name: "x/Motors",
    description: "Sharing knowledge and passion for classic and modern vehicles.",
    members: 5629,
    purpose: CampfirePurpose.Support,
    iconURL: "/assets/images/mas.webp",
    isMember: false
  },
  {
    campfireId: "5",
    name: "x/HealingJourney",
    description: "Step by step guidance to emotional healing and mindfulness.",
    members: 77,
    purpose: CampfirePurpose.Creative,
    isMember: false
  },
  {
    campfireId: "6",
    name: "x/GrowthMinds",
    description: "Self-development hacks, productivity tips, and life skills.",
    members: 34002020,
    purpose: CampfirePurpose.Growth,
    isMember: true
  },
  {
    campfireId: "7",
    name: "x/WellnessWaves",
    description: "Holistic health and fitness guidance for a better you.",
    members: 205,
    purpose: CampfirePurpose.Support,
    iconURL: "/assets/images/mas.webp",
    isMember: false,
  },
  {
    campfireId: "8",
    name: "x/ArtVibe",
    description: "A vibrant community for sharing art inspirations and tutorials.",
    members: 1920,
    purpose: CampfirePurpose.Creative,
    isMember: false,
  },
  {
    campfireId: "9",
    name: "x/PositivePals",
    description: "Daily motivation, positive affirmations, and support.",
    members: 410,
    purpose: CampfirePurpose.Support,
    iconURL: "/assets/images/mas.webp",
    isMember: false
  },
  {
    campfireId: "10",
    name: "x/MindMakers",
    description: "Workshops and group discussions for innovative thinkers.",
    members: 1282,
    purpose: CampfirePurpose.Growth,
    isMember: true
  },
  {
    campfireId: "11",
    name: "x/DreamBuilders",
    description: "Help and encouragement for entrepreneurs and dreamers.",
    members: 260,
    purpose: CampfirePurpose.Growth,
    iconURL: "/assets/images/mas.webp",
    isMember: false
  },
  {
    campfireId: "12",
    name: "x/StoryCircle",
    description: "Where storytellers and readers unite to share amazing tales.",
    members: 1422,
    purpose: CampfirePurpose.Creative,
    isMember: true
  }
];

const CampfiresList = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPurposes, setSelectedPurposes] = useState<CampfirePurpose[]>([]);


  // Helper function for join campfire
  const handleJoinClick = (campfireId: string) => {
    //Logic goes here
    return () => (console.log(campfireId));
  }

  // Helper for campfires search and filtering
  const filteredCampfires = campfires.filter((option) => {
    const matchesSearch =
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.campfireId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPurpose =
      selectedPurposes.length === 0 || selectedPurposes.includes(option.purpose);

    return matchesSearch && matchesPurpose;
  });


  return (
    <HealthTipsWrapper>
      <div className="w-full flex items-center flex-col gap-4 px-4">

        {/* Page Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Discover Campfires</h1>
          <p className="text-muted-foreground">
            Find your circle. Join discussions that matter to you.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex w-full items-center max-w-xl gap-4 justify-between md:justify-center sticky -top-8 z-50 py-2">
          <div className="flex items-center w-full sm:w-2/3 border rounded-s-2xl px-2">
            <Search className="w-5 h-5 text-muted-foreground mr-2" />
            <Input
              type="text"
              placeholder="Search by name or keyword"
              className="border-0 shadow-none focus-visible:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <FilterByPurpose
            selected={selectedPurposes}
            onChange={setSelectedPurposes}
          />
        </div>

        {/* Campfire list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 items-stretch gap-6 pt-4">
          {
            filteredCampfires.length === 0 ? (
              <div className={"flex w-full text-center text-neutral-400"}>
                No result match your search
              </div>
            ) : (
              filteredCampfires.map((campfire) => (
              <CampfireCard
                key={campfire.campfireId}
                campfireId={campfire.campfireId}
                name={campfire.name}
                description={campfire.description}
                members={campfire.members}
                purpose={campfire.purpose}
                iconURL={campfire.iconURL}
                onJoin={() => handleJoinClick(campfire.campfireId)}
                isMember={campfire.isMember}
              />
              )))
          }
        </div>
      </div>
    </HealthTipsWrapper>
  );
};
export default CampfiresList;

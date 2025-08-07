'use client';

import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";
import {Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

const Campfire = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <HealthTipsWrapper>
        <div className="flex flex-col w-full px-4">
          <div className="w-full max-w-xl flex flex-row gap-8">
            <div className="relative w-full">
              <span className="absolute inset-y-0 start-0 flex items-center ps-4">
                <Search className="w-4 h-4 text-muted-foreground" />
              </span>
              <Input
                type="text"
                name="searchInput"
                placeholder="Search campfires"
                className="rounded-full py-4 ps-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </HealthTipsWrapper>
    </>
  );
};

export default Campfire;

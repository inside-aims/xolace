'use client';

import React from "react";
import FeedList from "@/components/shared/FeedList";

const CampfireHighlight = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold ">
        Campfire Highlights
      </h2>
      <div>
        <FeedList />
      </div>
    </div>
  );
};
export default CampfireHighlight;
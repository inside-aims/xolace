import React from "react";

import ChannelPoliciesCard from "@/components/cards/ChannelPoliciesCard";
import ChannelQuestionsCard from "@/components/cards/ChannelQuestionsCard";
import ChannelContributionCard from "@/components/cards/ChannelContributionCard";
import ChannelAboutCard from "@/components/cards/ChannelAboutCard";
import ChannelUpdateCard from "@/components/cards/ChannelUpdateCard";

const Channel = () => {
  return (
    <div className="">
      <ChannelPoliciesCard />
      <ChannelQuestionsCard />
      <ChannelContributionCard />
      <ChannelAboutCard />
      <ChannelUpdateCard />
    </div>
  );
};

export default Channel;

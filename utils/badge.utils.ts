import { BadgeCriteriaType, BADGE_CRITERIA } from '@/constants/badges';
import { BadgeCounts } from '@/types/global';

export function assignBadges(params: {
  criteria: {
    type: BadgeCriteriaType;
    count: number;
  }[];
}): BadgeCounts {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach(item => {
    const { type, count } = item;
    const badgeLevels = BADGE_CRITERIA[type];

    // Check all levels and award highest achievement only
    //   if (count >= badgeLevels.GOLD) {
    //     badgeCounts.GOLD += 1;
    //   } else if (count >= badgeLevels.SILVER) {
    //     badgeCounts.SILVER += 1;
    //   } else if (count >= badgeLevels.BRONZE) {
    //     badgeCounts.BRONZE += 1;
    //   }

    // Check each level independently
    const earnedBronze = count >= badgeLevels.BRONZE;
    const earnedSilver = count >= badgeLevels.SILVER;
    const earnedGold = count >= badgeLevels.GOLD;

    if (earnedBronze) badgeCounts.BRONZE += 1;
    if (earnedSilver) badgeCounts.SILVER += 1;
    if (earnedGold) badgeCounts.GOLD += 1;
  });

  return badgeCounts;
}

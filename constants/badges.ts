
export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;

export const BADGE_CRITERIA = {
    POST_COUNT: {
      BRONZE: 50,
      SILVER: 150,
      GOLD: 500,
    },
    COMMENT_COUNT: {
      BRONZE: 50,
      SILVER: 150,
      GOLD: 500,
    },
    POST_UPVOTES: {
      BRONZE: 50,
      SILVER: 200,
      GOLD: 500,
    },
    TOTAL_VIEWS: {
      BRONZE: 1000,
      SILVER: 10000,
      GOLD: 100000,
    },
  } as const;
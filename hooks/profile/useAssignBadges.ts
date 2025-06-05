import { useQuery } from "@tanstack/react-query";
import { assignBadgesToUser } from "@/lib/actions/badge.action";

export function useAssignBadges(userId: string) {
    return useQuery({
        queryKey: ['assignBadges', userId],
        queryFn: async () => {
            const { badges } = await assignBadgesToUser(userId);
            return badges;
        },
        staleTime: 60 * 60 * 24, // 24 hours
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    });
}
// hooks/campfires/permissions/usePermissionGroups.ts
import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

export interface CampfirePermission {
  id: number;
  key: string;
  display_name: string;
  description: string;
  permission_group: 'manage_users' | 'manage_config' | 'manage_content';
  is_active: boolean;
  sort_order: number;
}

export interface PermissionGroup {
  group: string;
  label: string;
  description: string;
  permissions: CampfirePermission[];
}

const PERMISSION_GROUP_LABELS = {
  manage_users: {
    label: 'User Management',
    description: 'Manage community members, handle bans, mutes, and user moderation'
  },
  manage_config: {
    label: 'Configuration',
    description: 'Modify campfire settings, rules, and manage moderator roles'
  },
  manage_content: {
    label: 'Content Moderation', 
    description: 'Moderate posts, comments, and other content within the campfire'
  }
} as const;

export function getPermissionGroups() {
  const supabase = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ['permission-groups'],
    queryFn: async (): Promise<PermissionGroup[]> => {
      const { data, error } = await supabase
        .from('campfire_permissions')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch permissions: ${error.message}`);
      }

      // Group permissions by their permission_group
      const groupedPermissions = data.reduce((acc, permission) => {
        const group = permission.permission_group;
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(permission);
        return acc;
      }, {} as Record<string, CampfirePermission[]>);

      // Convert to PermissionGroup array with proper labeling
      return Object.entries(groupedPermissions).map(([group, permissions]) => ({
        group,
        label: PERMISSION_GROUP_LABELS[group as keyof typeof PERMISSION_GROUP_LABELS]?.label || group,
        description: PERMISSION_GROUP_LABELS[group as keyof typeof PERMISSION_GROUP_LABELS]?.description || '',
        permissions
      }));
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - permissions don't change frequently
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}
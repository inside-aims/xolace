export type EntityType = 'post' | 'comment' | 'vote' | 'report' | 'profile' | 'system';
export type ActionType = 'created' | 'deleted' | 'updated' | 'liked' | 'commented' | 'reported' | 'voted';

export interface User {
  id: string;
  name: string;
  avatar_url: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user: User;
  related_user_id?: string;
  related_user?: User;
  entity_type: EntityType;
  entity_id: string;
  action: ActionType;
  metadata: Record<string, any>;
  created_at: string;
  ip_address?: string;
}
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

export enum ActivityType{
  SIGNIN = 'signin',
  SIGNUP = 'signup',
  SIGNOUT = 'signout',
  POST = 'post',
  COMMENT = 'comment',
  VOTE = 'vote',
  REPORT = 'report',
  PROFILE = 'profile',
  SYSTEM = 'system',
  VIEW = 'view'
}

//
export interface DbUser{
  id: string;
  username: string;
  avatar_url: string;
}

// New interface based on the activity_logs database schema
export interface DbActivityLog {
  id: string;
  user_id: string;
  related_user_id?: string;
  entity_type: 'post' | 'comment' | 'vote' | 'report' | 'profile' | 'system' | 'view';
  
  // Entity-specific references
  post_id?: string;
  comment_id?: number;
  vote_id?: number;
  report_id?: number;
  profile_id?: string;
  
  action: 'created' | 'deleted' | 'updated' | 'commented' | 'reported' | 'upvoted' | 'downvoted' | 'viewed';
  metadata: Record<string, any>;
  created_at: string;
  ip_address?: string;
  
  // Join relationships
  profiles?: DbUser;
  related_profiles?: DbUser;
}
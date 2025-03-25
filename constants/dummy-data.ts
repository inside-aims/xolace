import { ActivityLog, EntityType, ActionType } from '@/types/activity';
import { v4 as uuidv4 } from 'uuid';

const users = [
  { id: uuidv4(), name: 'John Doe', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
  { id: uuidv4(), name: 'Jane Smith', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
  { id: uuidv4(), name: 'Alex Johnson', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: uuidv4(), name: 'Sarah Williams', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: uuidv4(), name: 'Michael Brown', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
];

// Assume the first user is the current user
const currentUser = users[0];

const entityTypes: EntityType[] = ['post', 'comment', 'vote', 'report', 'profile', 'system'];
const actions: ActionType[] = ['created', 'deleted', 'updated', 'liked', 'commented', 'reported', 'voted'];

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomDate = (daysBack = 30): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

export const generateDummyActivityLogs = (
  count: number, 
  filter = 'all', 
  viewType: 'my-activities' | 'related-to-me' = 'my-activities'
): ActivityLog[] => {
  const logs: ActivityLog[] = [];
  
  for (let i = 0; i < count; i++) {
    // For "my-activities", the current user is the actor
    // For "related-to-me", another user is the actor and current user is related
    const user = viewType === 'my-activities' 
      ? currentUser 
      : getRandomElement(users.filter(u => u.id !== currentUser.id));
    
    const relatedUser = viewType === 'my-activities'
      ? Math.random() > 0.5 ? getRandomElement(users.filter(u => u.id !== currentUser.id)) : undefined
      : currentUser;
    
    let entityType = getRandomElement(entityTypes);
    let action = getRandomElement(actions);
    
    // Apply filter if not 'all'
    if (filter !== 'all') {
      if (filter === 'likes') {
        entityType = 'post';
        action = 'liked';
      } else if (filter === 'comments') {
        entityType = 'post';
        action = 'commented';
      } else if (filter === 'votes') {
        entityType = 'vote';
        action = 'created';
      } else if (filter === 'posts') {
        entityType = 'post';
        action = 'created';
      }
    }
    
    const metadata: Record<string, any> = {};
    
    if (entityType === 'post') {
      metadata.title = `Sample post ${i + 1}`;
      metadata.content = `This is a sample post content for activity ${i + 1}`;
    } else if (entityType === 'comment') {
      metadata.content = `This is a sample comment for activity ${i + 1}`;
    }
    
    logs.push({
      id: uuidv4(),
      user_id: user.id,
      user,
      related_user_id: relatedUser?.id,
      related_user: relatedUser,
      entity_type: entityType,
      entity_id: uuidv4(),
      action,
      metadata,
      created_at: getRandomDate(),
      ip_address: '127.0.0.1',
    });
  }
  
  // Sort by created_at (newest first)
  return logs.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};
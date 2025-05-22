
import { createClient } from '@/utils/supabase/server';
import { reputationPoints } from '@/constants';
import { UpdateReputationParams } from '@/types/activity';

export async function updateReputation(params: UpdateReputationParams) {
  const supabase = await createClient();
  const { interaction, performerId, authorId } = params;
  const { action, entityType } = interaction;

  let performerPointsEarned = 0;
  let authorPointsEarned = 0;

  switch (action) {
    case 'upvoted':
      if (entityType === 'post' || entityType === 'comment') {
        performerPointsEarned = reputationPoints.upvote.performer;
        if (authorId) authorPointsEarned = reputationPoints.upvote.author;
      }
      break;
    case 'downvoted':
      if (entityType === 'post' || entityType === 'comment') {
        performerPointsEarned = reputationPoints.downvote.performer;
        if (authorId) authorPointsEarned = reputationPoints.downvote.author;
      }
      break;
    case 'created':
      if (entityType === 'post') {
        // Assuming 'post_created' covers general posts.
        // If you have specific types like 'question', you'd add more logic here or in constants.
        if (authorId) authorPointsEarned = reputationPoints.post_created.author;
      } else if (entityType === 'comment') {
        if (authorId) authorPointsEarned = reputationPoints.comment_created.author;
      }
      break;
    case 'deleted':
      if (entityType === 'post') {
        if (authorId) authorPointsEarned = reputationPoints.post_deleted.author;
      } else if (entityType === 'comment') {
        if (authorId) authorPointsEarned = reputationPoints.comment_deleted.author;
      }
      break;
    // Add other cases as needed based on your ActionType and EntityType combinations
  }

  try {
    // Update performer's reputation if they earned points and are not the author (or if it's a self-action where performer is the author)
    if (performerPointsEarned !== 0 && performerId && performerId !== authorId) {
      const { error: performerError } = await supabase
        .rpc('increment_reputation', { user_id_in: performerId, points_in: performerPointsEarned });
      if (performerError) {
        console.error(`Failed to update reputation for performer ${performerId}:`, performerError);
      }
    }

    // Update author's reputation if they earned points and are different from the performer
    if (authorPointsEarned !== 0 && authorId && performerId !== authorId) {
      const { error: authorError } = await supabase
        .rpc('increment_reputation', { user_id_in: authorId, points_in: authorPointsEarned });
      if (authorError) {
        console.error(`Failed to update reputation for author ${authorId}:`, authorError);
      }
    }
     // Handle cases where performer is the author (e.g. creating/deleting own post)
     // In this scenario, authorPointsEarned already contains the correct value for the user.
     if (authorPointsEarned !== 0 && authorId && performerId === authorId) {
      const { error: selfActionError } = await supabase
        .rpc('increment_reputation', { user_id_in: authorId, points_in: authorPointsEarned });
      if (selfActionError) {
        console.error(`Failed to update reputation for self-action user ${authorId}:`, selfActionError);
      }
    }

  } catch (error) {
    console.error('Error updating reputation:', error);
  }
}

// uses Supabase function `increment_reputation` like this:
// -- SQL for Supabase function
// CREATE OR REPLACE FUNCTION increment_reputation(user_id_in UUID, points_in INT)
// RETURNS VOID AS $$
// BEGIN
//   UPDATE profiles
//   SET reputation = reputation + points_in
//   WHERE id = user_id_in;
// END;
// $$ LANGUAGE plpgsql;
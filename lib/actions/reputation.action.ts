'use server';

import { createClient } from '@/utils/supabase/server';
import { reputationPoints } from '@/constants';
import { UpdateReputationParams } from '@/types/activity';

export async function updateReputation(params: UpdateReputationParams) {
  const supabase = await createClient();
  const { interaction, performerId, authorId, metadata } = params;
  const { action, entityType } = interaction;

  let performerPointsEarned = 0;
  let authorPointsEarned = 0;

  switch (action) {
    case 'upvoted':
      if (
        metadata?.content_type === 'post' ||
        metadata?.content_type === 'comment'
      ) {
        if (metadata?.action === 'added') {
          performerPointsEarned = reputationPoints.upvote.performer;
          if (authorId) authorPointsEarned = reputationPoints.upvote.author;
        } else if(metadata?.action ==='removed') {
          performerPointsEarned = reputationPoints.upvote.removed_performer;
          if (authorId)
            authorPointsEarned = reputationPoints.upvote.removed_author;
        } else if(metadata?.action ==='changed') {
            performerPointsEarned = reputationPoints.downvote.removed_performer + reputationPoints.upvote.performer;
            if (authorId)
              authorPointsEarned = reputationPoints.downvote.removed_author + reputationPoints.upvote.author;
          }
      }
      break;
    case 'downvoted':
      if (
        metadata?.content_type === 'post' ||
        metadata?.content_type === 'comment'
      ) {
        if (metadata?.action === 'added') {
          performerPointsEarned = reputationPoints.downvote.performer;
          if (authorId) authorPointsEarned = reputationPoints.downvote.author;
        }else if(metadata?.action === 'removed') {
          performerPointsEarned = reputationPoints.downvote.removed_performer;
          if (authorId)
            authorPointsEarned = reputationPoints.downvote.removed_author;
        } else if(metadata?.action ==='changed') {
          performerPointsEarned = reputationPoints.upvote.removed_performer + reputationPoints.downvote.performer;
          if (authorId)
            authorPointsEarned = reputationPoints.upvote.removed_author + reputationPoints.downvote.author;
        }
      }
      break;
    case 'created':
      if (entityType === 'post') {
        if (authorId) {
          if (metadata?.is_prompt_response) {
            authorPointsEarned = reputationPoints.prompt_post_created.author;
          } else {
            authorPointsEarned = reputationPoints.post_created.author;
          }
        }
      } else if (entityType === 'comment') {
        if (authorId)
          authorPointsEarned = reputationPoints.comment_created.author;
      }
      break;
    case 'deleted':
      if (entityType === 'post') {
        if (authorId) authorPointsEarned = reputationPoints.post_deleted.author;
      } else if (entityType === 'comment') {
        if (authorId)
          authorPointsEarned = reputationPoints.comment_deleted.author;
      }
      break;
      case 'viewed':
      if(entityType === 'view'){
        performerPointsEarned = reputationPoints.post_viewed.performer;
        if (authorId) authorPointsEarned = reputationPoints.post_viewed.author;
      }
      break;
    // Add other cases as needed based on your ActionType and EntityType combinations
  }

  try {
    // Update performer's reputation if they earned points and are not the author (or if it's a self-action where performer is the author)
    if (
      performerPointsEarned !== 0 &&
      performerId &&
      performerId !== authorId
    ) {
      const { error: performerError } = await supabase.rpc(
        'increment_reputation',
        { user_id_in: performerId, points_in: performerPointsEarned },
      );
      if (performerError) {
        console.error(
          `Failed to update reputation for performer ${performerId}:`,
          performerError,
        );
      }
    }

    // Update author's reputation if they earned points and are different from the performer
    if (authorPointsEarned !== 0 && authorId && performerId !== authorId) {
      const { error: authorError } = await supabase.rpc(
        'increment_reputation',
        { user_id_in: authorId, points_in: authorPointsEarned },
      );
      if (authorError) {
        console.error(
          `Failed to update reputation for author ${authorId}:`,
          authorError,
        );
      }
    }
    // Handle cases where performer is the author (e.g. creating/deleting own post)
    // In this scenario, authorPointsEarned already contains the correct value for the user.
    if (authorPointsEarned !== 0 && authorId && performerId === authorId) {
      const { error: selfActionError } = await supabase.rpc(
        'increment_reputation',
        { user_id_in: authorId, points_in: authorPointsEarned },
      );
      if (selfActionError) {
        console.error(
          `Failed to update reputation for self-action user ${authorId}:`,
          selfActionError,
        );
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

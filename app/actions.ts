'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSupabaseAdminClient } from '@/utils/supabase/adminClient';
import { signUpSchema, ResetPasswordSchema } from '@/validation';
import { validatedAction } from '@/lib/auth/middleware';
import { sendOTPCode } from '@/utils/sendOTPCode';
import { Post, Tag, User } from '@/types/global';
import { revalidatePath } from 'next/cache';
import { PostgrestError } from '@supabase/supabase-js';
import { logActivity } from '@/lib/activity-logger';
import { ActivityType } from '@/types/activity';
import { cache } from 'react';
import { createNotification } from '@/lib/actions/notifications.action';
import { FullFormType } from '@/components/professionals/states/StartingState';
import { uploadImageToBucket } from '@/utils/helpers/uploadImageToBucket';

export const signUpAction = validatedAction(signUpSchema, async data => {
  const supabaseAdmin = getSupabaseAdminClient();
  const { username, email, password, type } = data;
  const safeEmailString = encodeURIComponent(email);

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
    });

  if (userError) {
    const userExists = userError.message.includes('already been registered');
    if (userExists) {
      return {
        success: false,
        message: 'Failed to create user, User already exists!',
        email,
        password,
      };
    } else {
      return {
        success: false,
        message: 'Failed to create user. Please try again.',
        email,
        password,
      };
    }
  }

  //   get avatar
  let avatarUrl: URL;
  if (type === 'male') {
    avatarUrl = new URL(
      `https://avatar.iran.liara.run/public/boy?username=${username}`,
    );
  } else {
    avatarUrl = new URL(
      `https://avatar.iran.liara.run/public/girl?username=${username}`,
    );
  }

  // create user profile
  const { error: puError } = await supabaseAdmin
    .from('profiles')
    .insert({
      username: username,
      supabase_user: userData.user.id,
      avatar_url: avatarUrl,
      email: email,
    })
    .select()
    .single();

  if (puError) {
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
    return {
      success: false,
      message: 'Failed to create profile. Please try again.',
      email,
      password,
    };
  }

  const res = await sendOTPCode(email, 'signup');

  if (!res) {
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id);

    return {
      success: false,
      message: 'Ooops!! Failed to send email. Please try again.',
      email,
      password,
    };
  }

  const safeUserId = encodeURIComponent(userData.user.id);
  // redirect(`/registration-success?id=${safeUserId}&email=${safeEmailString}`);

  return {
    success: true,
    message: 'Account created successfully! Redirecting...',
    redirectUrl: `/registration-success?id=${safeUserId}&email=${safeEmailString}`,
  };
});

export const onBoardingFlowAction = async (data: FullFormType, selectedFile: File | null, inviteCode: string) => {
  const supabaseAdmin = getSupabaseAdminClient();
  const {
    email,
    fullName,
    field,
    bio,
    experience,
    title,
    languages,
    location,
    contact,
    confirmAccuracy,
    understandReview,
    agreeTerms,
    consentProcessing,
    avatar
  } = data;

  // 1. Generate a random default password
  const defaultPassword = Math.random().toString(36).slice(-12);

  // 2. Create the user
  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password: defaultPassword,
      email_confirm: true, // Auto-confirm email as we are verifying via password reset
    });

  if (userError) {
    return {
      success: false,
      message: userError.message.includes('already been registered')
        ? 'A user with this email already exists.'
        : 'Failed to create user. Please try again.',
    };
  }

  const userId = userData.user.id;

  // 2. Upload avatar
  const {success: avatarSuccess, path: avatarPath, message: avatarMessage} = await uploadImageToBucket({file: avatar, bucketName: 'professionals.bucket', supabase: supabaseAdmin, selectedFile, folder: 'avatars', owner: userId, bucketType: 'private'});

  let avatarUrl;
  if (avatarSuccess) {
    avatarUrl = avatarPath;
  }

  // 3. Create the user profile
  const {data: profileData, error: profileError } = await supabaseAdmin.from('profiles').insert({
    supabase_user: userId,
    username: fullName, // Using full name as username, can be changed later
    email: email,
    avatar_url: avatarUrl || `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(fullName)}`,
  }).select()
  .single();

  if (profileError || !profileData) {
    // Clean up created user if profile creation fails
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return {
      success: false,
      message: 'Failed to create profile. Please try again.',
    };
  }

  // 4. Create the health professional record
  const { error: professionalError } = await supabaseAdmin
    .from('health_professionals')
    .insert({
      id: profileData.id,
      field,
      bio,
      years_of_experience: parseInt(experience, 10),
      title,
      language: languages,
      location,
      contact,
      confirm_accuracy: confirmAccuracy,
      understand_review: understandReview,
      agree_terms: agreeTerms,
      consent_processing: consentProcessing,
    });

  if (professionalError) {
    // Clean up created user and profile if this step fails
    await supabaseAdmin.auth.admin.deleteUser(userId);
    // The profile will be deleted via cascade from the user deletion
    return {
      success: false,
      message: 'Failed to create health professional record. Please try again.',
    };
  }

  const {success: otpSuccess, message: otpMessage} = await sendSupabaseOTP(email);

  if (!otpSuccess) {
    return {
      success: false,
      message: otpMessage,
    };
  }

  // 5. Update invite code as used
await supabaseAdmin
    .from('professionals_invite_codes')
    .update({
      expired: true,
      expired_at: new Date(),
      professional: profileData.id,
    })
    .eq('code', inviteCode);

  const safeEmailString = encodeURIComponent(email);

  return {
    success: true,
    message:
      'Onboarding complete! Please check your email for OTP',
    redirectUrl: `/professionals/verify-otp?email=${safeEmailString}`,

  };
};

/**
 * Sends a verification OTP using Supabase's built-in auth.
 * This is used after a user has already been created.
 * @param {string} email - The recipient's email address.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendSupabaseOTP(email: string) {
  const supabase = await createClient();

  // This sends the OTP code to the user's email.
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Set to false because the user is already created in your signUpAction.
      // If OTP was the FIRST step of signup, you'd set this to true.
      shouldCreateUser: false,
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'OTP has been sent successfully.' };
}

export const verifyOTPAction = async (data: {email: string, otp_code: string}) => {
  const {email, otp_code} = data;
  const supabase = await createClient();
  
  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    email,
    token: otp_code,
    type: 'email',
  })

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  if(session) {
    return {
      success: true,
      message: 'OTP has been verified successfully. Please set new password. Redirecting...',
    };
  }

  return {
    success: false,
    message: 'Failed to verify OTP.',
  }
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  const callbackUrl = formData.get('callbackUrl')?.toString();

  if (!email) {
    return encodedRedirect('error', '/forgot-password', 'Email is required');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}api/v1/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    return encodedRedirect(
      'error',
      '/forgot-password',
      'Could not reset password',
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    'success',
    '/forgot-password',
    'Check your email for a link to reset your password.',
  );
};

export const resetPasswordAction = validatedAction(ResetPasswordSchema, async data => {
  const supabase = await createClient();

  const { newPassword, confirmNewPassword } = data;

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      success: false,
      message: 'Failed to update password',
      newPassword,
      confirmNewPassword,
    };
  }

  return {
    success: true,
    message: 'Password updated successfully',
  };
});

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/sign-in');
};

export const deleteUser = async (user: User) => {
  const supabase = getSupabaseAdminClient();
  const { error: deleteError } = await supabase.auth.admin.deleteUser(
    user.supabase_user ?? '',
  );

  if (deleteError) {
    return {
      success: false,
      message: 'Ooops!! Failed to delete your account. Please try again.',
    };
  }

  await signOutAction();
};

export async function updateViewsAction(
  postId: string,
  userId: string,
  relatedUserId: string | undefined,
  totalViews: number,
  content: string,
) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('views')
      .insert([{ user_id: userId || '', post_id: postId }])
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    // check if the user is the creator of the post
    const relatedUser = relatedUserId === userId ? undefined : relatedUserId;

    // Log the view activity
    await logActivity({
      userId,
      relatedUserId: relatedUser,
      entityType: ActivityType.VIEW,
      action: 'viewed',
      postId,
      metadata: {
        view_timestamp: new Date().toISOString(),
        views: totalViews + 1,
        content,
        link: `/post/${postId}`,
      },
    });

    if (userId !== relatedUserId && relatedUserId) {
      await createNotification({
        recipient_user_id: relatedUserId, // The video's author gets the notification
        actor_id: userId, // The user who saved the video
        type: 'post_viewed',
        entity_id: postId, // A link to the content
        metadata: {
          view_timestamp: new Date().toISOString(),
          views: totalViews + 1,
          content,
          link: `/post/${postId}`,
        },
      });
    }

    revalidatePath('/feed');
    revalidatePath('/explore');
    revalidatePath(`/post/${postId}`, 'page');

    return { success: true, data };
  } catch (error) {
    return error
      ? { success: false, error: 'Failed to update views' }
      : { success: false, error: 'Failed to update views, Try again!' };
  }
}

export async function voteAction(
  postId: string,
  voteType: 'upvote' | 'downvote',
  currentVote: 'upvote' | 'downvote' | null | undefined,
  user_id: string,
  relatedUserId: string,
) {
  const supabase = await createClient();

  try {
    const { data: voteResult, error: voteError } = await supabase.rpc(
      'handle_vote',
      {
        p_current_vote: currentVote,
        p_post_id: postId,
        p_user_id: user_id,
        p_vote_type: voteType,
      },
    );

    if (voteError) {
      return { success: false, error: voteError.message };
    }

    if(!voteResult.success){
      return { success: false, error: voteResult.error };
    }
    const relatedUser = relatedUserId === user_id ? undefined : relatedUserId;

    // Log the vote activity
    await logActivity({
      userId: user_id,
      relatedUserId: relatedUser,
      entityType: ActivityType.VOTE,
      action: voteType === 'upvote' ? 'upvoted' : 'downvoted',
      postId,
      voteId: voteResult.vote,
      metadata: {
        vote_type: voteType,
        action: voteResult.action,
        content_type: 'post',
        link: `/post/${postId}`,
      },
    });

    if (
      user_id !== relatedUserId &&
      relatedUserId &&
      voteResult.action === 'added'
    ) {
      await createNotification({
        recipient_user_id: relatedUserId, // The video's author gets the notification
        actor_id: user_id, // The user who saved the video
        type: voteType === 'upvote' ? 'new_upvote' : 'new_downvote',
        entity_id: postId, // A link to the content
        metadata: {
          vote_type: voteType,
          action: voteResult.action,
          content_type: 'post',
          link: `/post/${postId}`,
        },
      });
    }

    revalidatePath('/feed', 'page');
    revalidatePath('/explore', 'page');

    return { success: true, data: voteResult };
  } catch (error) {
    return error
      ? { success: false, error: 'Failed to process vote' }
      : { success: false, error: 'Failed to process vote, Try again' };
  }
}

export async function saveToCollectionAction(
  userId: string,
  relatedUserId: string,
  postId: string,
  collectionName: string = 'favorites',
) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('collections')
      .insert([
        { user_id: userId, post_id: postId, collection_name: collectionName },
      ])
      .select();

    if (error) return { success: false, error: error.message };

    // Log the collection activity
    await logActivity({
      userId,
      relatedUserId,
      entityType: ActivityType.POST,
      action: 'added',
      postId,
      metadata: {
        collection_name: collectionName,
        content_type: 'post',
        link: `/post/${postId}`,
      },
    });

    if (userId !== relatedUserId && relatedUserId) {
      await createNotification({
        recipient_user_id: relatedUserId, // The video's author gets the notification
        actor_id: userId, // The user who saved the video
        type: 'post_saved',
        entity_id: postId, // A link to the content
        metadata: {
          collection_name: collectionName,
          content_type: 'post',
          link: `/post/${postId}`,
        },
      });
    }

    revalidatePath('/feed', 'page');
    revalidatePath('/explore', 'page');
    return { success: true, data };
  } catch (error) {
    return error
      ? { success: false, error: 'Failed to save to collection' }
      : { success: false, error: 'Failed to save to collection, Try again' };
  }
}

export async function removeFromCollection(
  userId: string,
  postId: string,
  collectionName: string = 'favorites',
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId)
      .eq('collection_name', collectionName);

    if (error) return { success: false, error: error.message };

    // revalidate cached data
    revalidatePath('/feed', 'page');
    revalidatePath('/explore', 'page');

    return { success: true };
  } catch (error) {
    return error
      ? { success: false, error: 'Failed to remove from collection' }
      : {
          success: false,
          error: 'Failed to remove from collection, Try again!',
        };
  }
}

export async function saveVideoToCollectionAction({
  userId,
  videoId,
  bunny_video_id,
  createdBy,
  collectionName = 'favorites',
}: {
  userId: string;
  videoId: string;
  bunny_video_id: string;
  createdBy: string | null;
  collectionName?: string;
}) {
  if (!userId) throw new Error('User must be logged in.');
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('video_collections')
      .insert([
        { user_id: userId, video_id: videoId, collection_name: collectionName },
      ])
      .select()
      .single(); // Assuming you want the created record back

    if (error) {
      throw new Error(error.message);
    }

    // Log the activity
    await logActivity({
      userId,
      relatedUserId: createdBy,
      entityType: ActivityType.VIDEO, // Ensure your enum supports this
      action: 'added',
      videoId: videoId,
      metadata: {
        collection_name: collectionName,
        content_type: 'video',
        link: `/glimpse/${bunny_video_id}`,
      },
    });

    if (userId !== createdBy && createdBy) {
      await createNotification({
        recipient_user_id: createdBy, // The video's author gets the notification
        actor_id: userId, // The user who saved the video
        type: 'video_saved',
        entity_id: videoId, // A link to the content
        metadata: {
          collection_name: collectionName,
          content_type: 'video',
          link: `/glimpse/${bunny_video_id}`,
        },
      });
    }

    revalidatePath(`/video/${videoId}`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to save video to collection.',
    };
  }
}

export async function removeVideoFromCollectionAction({
  userId,
  videoId,
  collectionName = 'favorites',
}: {
  userId: string;
  videoId: string;
  collectionName?: string;
}) {
  if (!userId) throw new Error('User must be logged in.');
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('video_collections')
      .delete()
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .eq('collection_name', collectionName);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath(`/glimpse/${videoId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to remove from collection.',
    };
  }
}

// Fetch all posts in a user's collection (with pagination)
export const fetchCollectionPostsAction = async (
  userId: string,
  collectionName: string = 'favorites',
  page: number = 1,
  pageSize: number = 10,
) => {
  const supabase = await createClient();

  const {
    data,
    error,
  }: {
    data: { post_id: string; posts: Post[] }[] | null;
    error: PostgrestError | null;
  } = await supabase
    .from('collections')
    .select(
      `
      post_id,
      posts (
        *,
        posttags (
          tags (
            name
          )
        ),
        votes (
          user_id,
          vote_type
        ),
        comments:comments (
          count
        ),
        views:views (
          count
        ),
        collections (
          user_id
        )
      )
    `,
    )
    .eq('user_id', userId)
    .eq('collection_name', collectionName)
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Extract and return the nested posts data
  return data?.map(entry => entry.posts) || [];
};

export const fetchTags = async () => {
  const supabase = await createClient();

  const { data, error }: { data: Tag[] | null; error: PostgrestError | null } =
    await supabase
      .from('tags')
      .select(
        `
      *
    `,
      )
      .limit(6)
      .order('post', { ascending: false });

  if (error) throw error;

  return data || [];
};

export async function fetchDailyPromptAction() {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data: promptData, error } = await supabase
      .from('daily_prompts')
      .select(
        `
        id,
        prompt_text,
        created_at,
        active_on
      `,
      )
      .eq('active_on', today)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: promptData };
  } catch (error) {
    return error
      ? { success: false, error: 'Failed to fetch daily prompt' }
      : { success: false, error: 'Failed to fetch daily prompt, Try again' };
  }
}

export const fetchUserStreakAction = cache(async (userId: string) => {
  if (!userId) {
    return { success: false, error: 'User ID is required.', data: null };
  }
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('prompt_streaks')
      .select('current_streak, last_response_date')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116: "Not Found" - user might not have a streak record yet
        return {
          success: true,
          data: { current_streak: 0, last_response_date: null },
        };
      }
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data: data };
  } catch (error) {
    return error
      ? { success: false, error: 'Failed to fetch user streak', data: null }
      : {
          success: false,
          error: 'Failed to fetch user streak, Try again',
          data: null,
        };
  }
});

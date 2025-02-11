'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSupabaseAdminClient } from '@/utils/supabase/adminClient';
import { signUpSchema } from '@/validation';
import { validatedAction } from '@/lib/auth/middleware';
import { sendOTPLink } from '@/utils/sendOTPLink';
import { Post, User } from '@/types/global';
import { revalidatePath } from 'next/cache';
import { PostgrestError } from '@supabase/supabase-js';

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

  const request = {
    url: process.env.NEXT_PUBLIC_BASE_APP_URL,
  };


  const res = await sendOTPLink(email, 'signup', request);

  if (!res) {
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id);

    return {
      success: false,
      message: 'Ooops!! Failed to send email. Please try again.',
      email,
      password,
    };
  }

  redirect(`/registration-success?email=${safeEmailString}`);
});

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

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      'error',
      '/change-password',
      'Password and confirm password are required',
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect('error', '/change-password', 'Passwords do not match');
  }

  // Validate password strength
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return encodedRedirect(
      'error',
      '/change-password',
      'Password must be at least 8 characters long, contain at least 1 uppercase letter, and 1 number'
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect('error', '/change-password', 'Password update failed');
  }

  encodedRedirect('success', '/change-password', 'Password updated');
};

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
    return  {
      success: false,
      message: 'Ooops!! Failed to delete your account. Please try again.',
    };
  }

  await signOutAction();
};

export async function updateViewsAction(postId: string, userId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('views')
      .insert([{ user_id: userId || '', post_id: postId }])
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate both feed and explore paths since they both show post data
    revalidatePath('/feed');
    revalidatePath('/explore');

    return { success: true, data };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, error: 'Failed to update views' };
  }
}

export async function voteAction(
  postId: string,
  voteType: 'upvote' | 'downvote',
  currentVote: string | null,
  user_id: string,
) {
  const supabase = await createClient();

  try {
    // Start a transaction by using supabase's RPC call
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

    // Revalidate paths that show posts
    revalidatePath('/feed', 'page');
    revalidatePath('/explore', 'page');
    // revalidatePath(`/post/${postId}`);

    return { success: true, data: voteResult };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, error: 'Failed to process vote' };
  }
}

export async function saveToCollectionAction(
  userId: string,
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

    revalidatePath('/feed', 'page');
    revalidatePath('/explore', 'page');
    return { success: true, data };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, error: 'Failed to save to collection' };
  }
}

export async function removeFromCollection(userId: string, postId: string, collectionName: string = 'favorites') {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId)
      .eq('collection_name', collectionName)

    if (error) return { success: false, error: error.message }; 

    // revalidate cached data
    revalidatePath('/feed', 'page');
    revalidatePath('/explore', 'page');

    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, error: 'Failed to remove from collection' };
  }
}

// Fetch all posts in a user's collection (with pagination)
export const fetchCollectionPostsAction = async (
  userId: string,
  collectionName: string = 'favorites',
  page: number = 1,
  pageSize: number = 10
) => {

  const supabase = await createClient();

  const { data, error }: {data: {post_id: string, posts: Post[]}[] | null, error: PostgrestError | null}  = await supabase
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
    `
    )
    .eq('user_id', userId)
    .eq('collection_name', collectionName)
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Extract and return the nested posts data
  return data?.map((entry) => entry.posts) || [];
};

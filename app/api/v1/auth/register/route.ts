import { getSupabaseAdminClient } from '@/utils/supabase/adminClient';
import { sendOTPLink } from '@/utils/sendOTPLink';
import { builderUrl } from '@/utils/url-helpers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const { searchParams } = new URL(request.url);
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const type = searchParams.get('type') as string;

  console.log(formData);
  console.log(username, email, password, type);

  const isNonEmptyString = (value: string) =>
    typeof value === 'string' && value.trim().length > 0;

  const emailRegex = /^\S+@\S+$/;
  if (
    !isNonEmptyString(username) ||
    !isNonEmptyString(email) ||
    !emailRegex.test(email) ||
    !isNonEmptyString(password)
  ) {
    return NextResponse.redirect(builderUrl('/error', request), 302);
  }

  if (username.length < 2 || password.length < 8) {
    return NextResponse.redirect(builderUrl('/error', request), 302);
  }

  const supabaseAdmin = getSupabaseAdminClient();

  const safeEmailString = encodeURIComponent(email);

  console.log('Creating account');
  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
    });

  console.log('User data -> ', userData);

  if (userError) {
    const userExists = userError.message.includes('already been registered');
    if (userExists) {
      return NextResponse.redirect(
        builderUrl(
          `/error?type=register_mail_exists&email=${safeEmailString}`,
          request,
        ),
        302,
      );
    } else {
      return NextResponse.redirect(
        builderUrl('/error?type=register_unknown', request),
        302,
      );
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

  const { data: profileUser, error: puError } = await supabaseAdmin
    .from('profiles')
    .insert({
      username: username,
      supabase_user: userData.user.id,
      avatar_url: avatarUrl,
    })
    .select()
    .single();

  console.log('Profile -> ', profileUser);

  if (puError) {
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
    return NextResponse.redirect(builderUrl('/error', request), 302);
  }

  await sendOTPLink(email, 'signup', request);

  return NextResponse.redirect(
    builderUrl(`/registration-success?email=${safeEmailString}`, request),
    302,
  );
}

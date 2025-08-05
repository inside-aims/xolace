import { getSupabaseAdminClient } from '@/utils/supabase/adminClient';
import { sendOTPCode } from '@/utils/sendOTPCode';
import { NextResponse } from 'next/server';


interface ResendRequest {
    email: string;
    id: string;
  }
  
  export async function POST(request: Request) {
    try {
      const { email, id } = await request.json() as ResendRequest;

    const isNonEmptyString = (value: string | null): value is string =>
      typeof value === 'string' && value.trim().length > 0;

    const emailRegex = /^\S+@\S+$/;
    if (!isNonEmptyString(email) || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 },
      );
    }

    if (!isNonEmptyString(id)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 },
      );
    }

    const supabaseAdmin = getSupabaseAdminClient();

    // Check if user exists and is not confirmed
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(id);

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 404 },
      );
    }

    // If user is already confirmed
    if (userData.user.email_confirmed_at) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 },
      );
    }

    // Send new verification email
    const emailSent = await sendOTPCode(email, 'signup');

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: 'Verification email resent successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in resend verification:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}

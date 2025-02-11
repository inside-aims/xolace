import { NextResponse } from 'next/server';
import { builderUrl } from '@/utils/url-helpers';
import { sendOTPLink } from '@/utils/sendOTPLink';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get('email');
  const type = formData.get('type') === 'recovery' ? 'recovery' : 'magiclink';


  const errorUrl = builderUrl(`/error?type=${type}`, request);
  const thanksUrl = builderUrl(`/magic-thanks?type=${type}`, request);

  const otpSuccess = await sendOTPLink(email, type, request);

  if (!otpSuccess) {
    return NextResponse.redirect(errorUrl, 302);
  } else {
    return NextResponse.redirect(thanksUrl, 302);
  }
}

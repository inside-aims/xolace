import { NextResponse } from 'next/server';
import { builderUrl } from '@/utils/url-helpers';
import { sendOTPCode } from '@/utils/sendOTPCode';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get('email');
  const type = formData.get('type') === 'recovery' ? 'recovery' : 'magiclink';


  const errorUrl = builderUrl(`/error?type=${type}`, request);
  const thanksUrl = builderUrl(`/magic-thanks?type=${type}`, request);

  let otpUrl;
  if(type === 'recovery'){
    otpUrl = builderUrl(`/password-reset-otp?email=${email}`, request);
  }

  const otpSuccess = await sendOTPCode(email, type);

  if (!otpSuccess) {
    return NextResponse.redirect(errorUrl, 302);
  } else {
    return NextResponse.redirect(otpUrl || thanksUrl, 302);
  }
}

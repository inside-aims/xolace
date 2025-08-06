import { getSupabaseAdminClient } from './supabase/adminClient';
import nodemailer from 'nodemailer';

export async function sendOTPCode(email, type, request) {
  const supabaseAdmin = getSupabaseAdminClient();

  const { data: linkData, error: glError } =
    await supabaseAdmin.auth.admin.generateLink({
      email,
      type,
    });

  if (glError) {
    return false;
  }

  // extracting the email_otp from the link data
  const { email_otp } = linkData.properties;

  // initialize the mailing transport
  const transporter = nodemailer.createTransport({
    host: process.env.RESEND_MAIL_HOST,
    secure: true,
    port: process.env.RESEND_MAIL_PORT,
    auth: {
      user: process.env.RESEND_USERNAME,
      pass: process.env.RESEND_API_KEY,
    }
  });

  let mailSubject = '';
  let welcomeMessage = '';
  let actionDescription = '';

  if (type === 'signup') {
    mailSubject = 'Welcome to Xolace - Verify your account';
    welcomeMessage = 'Welcome to our Campfire';
    actionDescription = 'complete your registration';
  } else if (type === 'recovery') {
    mailSubject = 'Xolace - Password reset verification';
    welcomeMessage = 'Password reset requested';
    actionDescription = 'reset your password';
  } else {
    mailSubject = 'Xolace - Secure login code';
    welcomeMessage = 'Secure login requested';
    actionDescription = 'sign in to your account';
  }

  await transporter.sendMail({
    from: 'Xolace <verify@mail.xolace.app>',
    to: email,
    subject: mailSubject,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>${mailSubject}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #667eea;
        }
        
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 32px;
            text-align: center;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: rgba(255,255,255,0.2);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
        }
        
        .brand-text {
            color: white;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: -0.5px;
        }
        
        .header-title {
            color: white;
            font-size: 28px;
            font-weight: 600;
            margin: 0;
            letter-spacing: -0.5px;
        }
        
        .header-subtitle {
            color: rgba(255,255,255,0.9);
            font-size: 16px;
            margin: 8px 0 0 0;
            font-weight: 400;
        }
        
        .content {
            padding: 48px 32px;
            text-align: center;
        }
        
        .greeting {
            font-size: 18px;
            color: #374151;
            margin: 0 0 8px 0;
            font-weight: 500;
        }
        
        .description {
            font-size: 16px;
            color: #6B7280;
            margin: 0 0 40px 0;
            line-height: 1.5;
        }
        
        .otp-container {
            background: #F9FAFB;
            border: 2px solid #E5E7EB;
            border-radius: 16px;
            padding: 32px;
            margin: 0 0 32px 0;
        }
        
        .otp-label {
            font-size: 14px;
            color: #6B7280;
            margin: 0 0 16px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 500;
        }
        
        .otp-code {
            font-size: 42px;
            font-weight: 700;
            color: #1F2937;
            letter-spacing: 8px;
            margin: 0;
            font-family: 'Courier New', monospace;
            text-align: center;
        }
        
        .timer-info {
            background: #FEF3C7;
            border: 1px solid #F59E0B;
            border-radius: 12px;
            padding: 16px;
            margin: 32px 0;
        }
        
        .timer-text {
            font-size: 14px;
            color: #92400E;
            margin: 0;
            font-weight: 500;
        }
        
        .instructions {
            font-size: 15px;
            color: #4B5563;
            line-height: 1.6;
            margin: 0 0 32px 0;
        }
        
        .security-note {
            background: #F3F4F6;
            border-radius: 12px;
            padding: 20px;
            margin: 32px 0;
        }
        
        .security-text {
            font-size: 13px;
            color: #6B7280;
            margin: 0;
            line-height: 1.5;
        }
        
        .footer {
            background: #F9FAFB;
            padding: 32px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
        }
        
        .footer-text {
            font-size: 13px;
            color: #9CA3AF;
            margin: 0 0 12px 0;
            line-height: 1.5;
        }
        
        .company-info {
            font-size: 12px;
            color: #9CA3AF;
            margin: 0;
        }

        @media only screen and (max-width: 640px) {
            body {
                background-color: #667eea !important;
            }
            
            .container {
                margin: 10px !important;
                border-radius: 12px;
            }
            
            .header {
                padding: 32px 24px;
            }
            
            .content {
                padding: 32px 24px;
            }
            
            .otp-code {
                font-size: 36px;
                letter-spacing: 6px;
            }
            
            .footer {
                padding: 24px;
            }
        }
    </style>
</head>
<body>
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; margin: 0;">
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img alt="Xolace" height="80" src="https://www.xolace.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fx-logo-full.ed0794df.webp&w=128&q=75" style="display:block;outline:none;border:none;text-decoration:none" width="80" />
                </div>
                <h1 class="header-title">${welcomeMessage}</h1>
                <p class="header-subtitle">Enter the code below to ${actionDescription}</p>
            </div>
            
            <div class="content">
                <p class="greeting">Hi there!</p>
                <p class="description">
                    Use this verification code to ${actionDescription}. 
                    This code will expire in 60 minutes for your security.
                </p>
                
                <div class="otp-container">
                    <p class="otp-label">Verification Code</p>
                    <p class="otp-code">${email_otp}</p>
                </div>
                
                <div class="timer-info">
                    <p class="timer-text">⏰ This code expires in 1 hour</p>
                </div>
                
                <p class="instructions">
                    Enter this 6-digit code on the verification page to continue. 
                    If you didn't request this code, you can safely ignore this email.
                </p>
                
                <div class="security-note">
                    <p class="security-text">
                        🔒 <strong>Security reminder:</strong> Never share this code with anyone. 
                        Xolace will never ask for your verification code via phone or email.
                    </p>
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    This email was sent from Xolace. If you have any questions, 
                    contact us at xolace25@gmail.com
                </p>
                <p class="company-info">
                    Xolace Inc. • Koforidua, Poly-Junction<br>
                    © ${new Date().getFullYear()} Xolace. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `,
    text: `
${welcomeMessage}

Hi there!

Use this verification code to ${actionDescription}: ${email_otp}

This code will expire in 60 minutes for your security.

Enter this 6-digit code on the verification page to continue. If you didn't request this code, you can safely ignore this email.

Security reminder: Never share this code with anyone. Xolace will never ask for your verification code via phone or email.

This email was sent from Xolace. If you have any questions, contact us at xolace25@gmail.com

Xolace Inc. • Koforidua, Poly-Junction
© ${new Date().getFullYear()} Xolace. All rights reserved.
    `
  });

  return true;
}
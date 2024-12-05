import { getSupabaseAdminClient } from "./supabase/adminClient";
import nodemailer from "nodemailer";
import { builderUrl } from "./url-helpers";

export async function sendOTPLink(email, type, request) {
  const supabaseAdmin = getSupabaseAdminClient();

  const { data: linkData, error } = await supabaseAdmin.auth.admin.generateLink(
    {
      email,
      type,
    }
  );

  console.log("generated link");

  const user = linkData.user;
  console.log(user);

  // extracting the hashed_token from the link
  const { hashed_token } = linkData.properties;

  // construct a custom link with the hashed_token
  const constructedLink = builderUrl(
    `/auth/verify?hashed_token=${hashed_token}&type=${type}`,
    request
  );

  // initialize the mailing transport
  const transporter = nodemailer.createTransport({
    host: process.env.RESEND_MAIL_HOST,
    secure: true,
    port: process.env.RESEND_MAIL_PORT,
    auth:{
      user: process.env.RESEND_USERNAME,
      pass: process.env.RESEND_API_KEY,
    }
  });

  let mailSubject = "";
  let initialSentence = "";
  let sentenceEnding = "";

  if (type === "signup") {
    mailSubject = "Activate your account";
    initialSentence = "Hi there, you successfully signed up!";
    sentenceEnding = "activate your account";
  } else if (type === "recovery") {
    mailSubject = "New password requested";
    initialSentence = "Hi there, you requested a password change!";
    sentenceEnding = "change it";
  } else {
    mailSubject = "Magic Link requested";
    initialSentence = "Hey, you requested a magic login link!";
    sentenceEnding = "log in";
  }

  await transporter.sendMail({
    from: "Atlas Innovation & Meta Solution , aims5824@gmail.com",
    to: email,
    subject: mailSubject,
    html: `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html dir="ltr" lang="en">

    <head>
      <link rel="preload" as="image" href="https://xolace.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fxolace-1.png&w=640&q=75" />
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
      <meta name="x-apple-disable-message-reformatting" /><!--$-->
    </head>
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Log in with this magic link.<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
    </div>

    <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
      <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;margin:0 auto;padding:20px 25px 48px;background-image:url(&quot;/assets/raycast-bg.png&quot;);background-position:bottom;background-repeat:no-repeat, no-repeat">
        <tbody>
          <tr style="width:100%">
            <td><img alt="Xolace" height="110" src="https://xolace.vercel.app/_next/image?url=%2Fassets%2Fimages%2Ftwitter-image.png&w=640&q=75" style="display:block;outline:none;border:none;text-decoration:none" width="110" />
              <h1 style="font-size:28px;font-weight:bold;margin-top:20px">🪄 ${initialSentence}</h1>
              <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin:24px 0">
                <tbody>
                  <tr>
                    <td>
                      <p style="font-size:16px;line-height:26px;margin:16px 0"><a href="${constructedLink.toString()}" style="color:#FF6363;text-decoration-line:none" target="_blank">👉 Click here to ${sentenceEnding} 👈</a></p>
                      <p style="font-size:16px;line-height:26px;margin:16px 0">If you didn&#x27;t request this, please ignore this email.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p style="font-size:16px;line-height:26px;margin:16px 0">Best,<br />- Atlas Innovations & Meta Solutions Team</p>
              <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#dddddd;margin-top:48px" /><img alt="AIMS logo" height="60" src="https://xolace.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fxolace-1.png&w=640&q=75" style="display:block;outline:none;border:none;text-decoration:none;-webkit-filter:grayscale(100%);filter:grayscale(100%);margin:20px 0" width="60" />
              <p style="font-size:12px;line-height:24px;margin:16px 0;color:#8898aa;margin-left:4px">Atlas Innovations & Meta Solutions</p>
              <p style="font-size:12px;line-height:24px;margin:16px 0;color:#8898aa;margin-left:4px">Koforidua #3222, Claymont, DE 19703</p>
            </td>
          </tr>
        </tbody>
      </table><!--/$-->
    </body>

  </html>
    `,
  });

  return true;
}

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

  // extracting the hashed_token from the link
  const { hashed_token } = linkData.properties;

  // construct a custom link with the hashed_token
  const constructedLink = builderUrl(
    `/auth/verify?hashed_token=${hashed_token}&type=${type}`,
    request
  );

  // initialize the mailing transport
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 54325,
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
    from: "Atlas Innovation & Meta Solution , aims5824@example.com",
    to: email,
    subject: mailSubject,
    html: `
    <h1>${initialSentence}</h1>
    <p>Click <a href="${constructedLink.toString()}">here</a> to ${sentenceEnding}.</p>
    `,
  });

  return true;
}

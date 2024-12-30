import { getSupabaseAdminClient } from "@/utils/supabase/adminClient";
import { sendOTPLink } from "@/utils/sendOTPLink";
import { builderUrl } from "@/utils/url-helpers";
import { NextResponse } from "next/server";
import { signUpSchema } from "@/validation";

export async function POST(request: any) {
  const formData = await request.formData();
  const { searchParams } = new URL(request.url);
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const type = searchParams.get("type");

  console.log(formData);
  console.log(username, email, password, type);

  const isNonEmptyString = (value: any) =>
    typeof value === "string" && value.trim().length > 0;

  const emailRegex = /^\S+@\S+$/;
  if (
    !isNonEmptyString(username) ||
    !isNonEmptyString(email) ||
    !emailRegex.test(email) ||
    !isNonEmptyString(password)
  ) {
    return NextResponse.redirect(builderUrl("/error", request), 302);
  }

  if (username.length < 2 || password.length < 8) {
    return NextResponse.redirect(builderUrl("/error", request), 302);
  }

  const [, emailHost] = email.split("@");

  const supabaseAdmin = getSupabaseAdminClient();
  //   const { error } = await supabaseAdmin
  //     .from("tenants")
  //     .select("*")
  //     .eq("id", tenant)
  //     .eq("domain", emailHost)
  //     .single();

  const safeEmailString = encodeURIComponent(email);
  //   if (error) {
  //     return NextResponse.redirect(
  //       buildUrl(
  //         `/error?type=register_mail_mismatch&email=${safeEmailString}`,
  //         tenant,
  //         request,
  //       ),
  //       302,
  //     );
  //   }

  console.log("Creating account");
  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,

      //   app_metadata: {
      //     tenants: [tenant],
      //   },
    });

  console.log("User data -> ", userData);

  if (userError) {
    const userExists = userError.message.includes("already been registered");
    if (userExists) {
      return NextResponse.redirect(
        builderUrl(
          `/error?type=register_mail_exists&email=${safeEmailString}`,
          request
        ),
        302
      );
    } else {
      return NextResponse.redirect(
        builderUrl("/error?type=register_unknown", request),
        302
      );
    }
  }

  //   get avatar
  let gender: string = "";
  let avatarUrl: URL;
  if (type === "male") {
    gender = "boy";
    avatarUrl = new URL(
      `https://avatar.iran.liara.run/public/boy?username=${username}`
    );
  } else {
    gender = "girl";
    avatarUrl = new URL(
      `https://avatar.iran.liara.run/public/girl?username=${username}`
    );
  }

  const { data: profileUser, error: puError } = await supabaseAdmin
    .from("profiles")
    .insert({
      username: username,
      supabase_user: userData.user.id,
      avatar_url: avatarUrl,
    })
    .select()
    .single();

  console.log("Profile -> ", profileUser);

  //   const { error: tpError } = await supabaseAdmin
  //     .from("tenant_permissions")
  //     .insert({
  //       tenant,
  //       service_user: serviceUser?.id,
  //     });

  if (puError) {
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
    return NextResponse.redirect(builderUrl("/error", request), 302);
  }

  await sendOTPLink(email, "signup", request);

  return NextResponse.redirect(
    builderUrl(`/registration-success?email=${safeEmailString}`, request),
    302
  );
}

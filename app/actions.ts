"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdminClient } from "@/utils/supabase/adminClient";
import { signUpSchema } from "@/validation";
import { validatedAction } from "@/lib/auth/middleware";
import { sendOTPLink } from "@/utils/sendOTPLink";

export const signUpAction = validatedAction(signUpSchema, async (data, formData) => {
  const supabaseAdmin = getSupabaseAdminClient();
  const { username, email, password, type } = data;
  const safeEmailString = encodeURIComponent(email);

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
    });

  if (userError) {
    const userExists = userError.message.includes("already been registered");
    if (userExists) {
      return {
        success: false,
        message: "Failed to create user, User already exists!",
        email,
        password,
      };
    } else {
      return {
        success: false,
        message: "Failed to create user. Please try again.",
        email,
        password,
      };
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

  // create user profile
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

  if (puError) {
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
    return {
      success: false,
      message: "Failed to create profile. Please try again.",
      email,
      password,
    };
  }

  const request = {
    url: process.env.NEXT_PUBLIC_BASE_APP_URL,
  };

  const res = await sendOTPLink(email, "signup", request);

  if (!res) {
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id);

    return {
      success: false,
      message: "Ooops!! Failed to send email. Please try again.",
      email,
      password,
    };
  }

  redirect(`/registration-success?email=${safeEmailString}`);
});

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}api/v1/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/change-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", "/change-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect("error", "/change-password", "Password update failed");
  }

  encodedRedirect("success", "/change-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const deleteUser = async (user: any) => {
  console.log("Delete-> ", user);
  const supabase = getSupabaseAdminClient();
  const { error: deleteError } = await supabase.auth.admin.deleteUser(
    user?.supabase_user
  );

  if (deleteError) {
    console.log("Error deleting user ", deleteError);
    return;
  }

  await signOutAction();
};

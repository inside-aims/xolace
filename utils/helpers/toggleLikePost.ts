import { getSupabaseBrowserClient } from "../supabase/client";

export const toggleLikePost = async (
  postId: any,
  isLiked: boolean,
  userId: any
) => {
  const supabase = getSupabaseBrowserClient();

  let result;
  if (isLiked) {
    // If already liked, remove the like
    result = // If already liked, remove the like
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId.id);
  } else {
    // If not liked, insert a new like
    result = await supabase.from("likes").insert({ post_id: postId });
  }

  if (result.error) {
    throw result.error;
  }

  return result.data;
};

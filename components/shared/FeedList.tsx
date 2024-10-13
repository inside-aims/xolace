import React from "react";

import { PostCard } from "@/components/cards/PostCard";
import { createClient } from "@/utils/supabase/server";

const FeedList = async () => {
  const supabase = createClient();

  const supabase_user_id: string | null =
    (await supabase.auth.getUser()).data?.user?.id ?? null;
  if (!supabase_user_id) {
    throw new Error();
  }

  const { data: profileUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("supabase_user", supabase_user_id)
    .single();

  let postStatement = supabase
    .from("posts")
    .select(
      `
       *,
          likes(
          *
          )
    `
    )
    .order("created_at", { ascending: false });
  const { data: posts, error } = await postStatement;

  //   const { data: testData, error: postError } = await supabase.from("posts")
  //     .select(`
  //        *,
  //           likes(
  //           *
  //           )
  //     `);

  console.log(
    "posts -> ",
    posts?.map((test) => test)
  );

  return (
    <>
      <ul className="flex flex-col flex-1 gap-3 w-full ">
        {(posts || []).map((post) => (
          <li key={`${post.id}`} className="flex justify-center w-full ">
            <PostCard post={post} userId={profileUser} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default FeedList;

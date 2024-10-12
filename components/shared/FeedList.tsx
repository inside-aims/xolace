import React from "react";

import { PostCard } from "@/components/cards/PostCard";
import { createClient } from "@/utils/supabase/server";

const FeedList = async () => {
  const supabase = createClient();

  let postStatement = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: posts, error } = await postStatement;

  //   const { data: testData, error: postError } = await supabase.from("post")
  //     .select(`
  //     id,
  //     username,
  //     posts ( id, content )
  //   `);

  console.log("relationship posts -> ", posts);

  return (
    <>
      <ul className="flex flex-col flex-1 gap-3 w-full ">
        {(posts || []).map((post) => (
          <li key={`${post.id}`} className="flex justify-center w-full ">
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default FeedList;

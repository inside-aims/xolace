"use client";

import React, { useState, useEffect } from "react";

import { PostCard } from "@/components/cards/PostCard";
import { createClient } from "@/utils/supabase/server";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import Loader from "./Loader";

const FeedList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const fetchPost = async () => {
      let postStatement = supabase
        .from("posts")
        .select(
          `
     *,
        likes(
        *
        ),
        comments:comments(count)
  `
        )
        .order("created_at", { ascending: false });
      const { data: postsData, error } = await postStatement;

      if (error) {
        console.error("Error fetching posts:", error.message);
        return;
      }

      setPosts(postsData);
    };

    fetchPost();
    setIsLoading(false);
  }, []);

  useEffect((): any => {
    const listener = (payload: any) => {
      const eventType = payload.eventType;

      console.log("eventType", payload);

      if (eventType === "INSERT") {
        console.log("Inserting post");
      } else if (eventType === "DELETE") {
        setPosts((prevComments: any) =>
          prevComments.filter((comment: any) => comment.id !== payload.old.id)
        );
      } else if (eventType === "UPDATE") {
        setPosts((prevPosts: any) =>
          prevPosts.map((post: any) =>
            post.id === payload.new.id ? payload.new : post
          )
        );
      }
    };

    const subscription = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
          // filter: `ticket=eq.${ticket}`,
        },
        listener
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  // const supabase_user_id: string | null =
  //   (await supabase.auth.getUser()).data?.user?.id ?? null;
  // if (!supabase_user_id) {
  //   throw new Error();
  // }

  // const { data: profileUser } = await supabase
  //   .from("profiles")
  //   .select("id")
  //   .eq("supabase_user", supabase_user_id)
  //   .single();

  //   const { data: testData, error: postError } = await supabase.from("posts")
  //     .select(`
  //        *,
  //           likes(
  //           *
  //           )
  //     `);

  console.log(
    "posts -> ",
    posts?.map((test) => test.comments[0].count)
  );

  return (
    <>
      {isLoading && (
        <div>
          <Loader />
        </div>
      )}
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
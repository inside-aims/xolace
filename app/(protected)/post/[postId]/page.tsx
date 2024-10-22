import { DoubleArrowLeftIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";

import { DetailCard } from "@/components/cards/DetailCard";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import PostDetailDrawer from "@/components/ui/PostDetailDrawer";
import { createClient } from "@/utils/supabase/server";

const PostDetailPage = async ({ params }: { params: { postId: string } }) => {
  const supabase = createClient();
  const { postId } = params;

  // incase there is no post id
  if (!postId) {
    console.error("postId is missing from params.");
    return notFound();
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select(
      `
      *,
         likes(
         *
         ),
         comments(*)
   `
    )
    .eq("id", postId)
    .order("created_at", { ascending: true, referencedTable: "comments" })
    .single();

  console.log(error);
  //  check for error
  if (error) {
    console.error("Error fetching post:", error.message);
    return notFound();
  }

  return (
    <>
      {/* <Button
        variant={"link"}
        className="dark:text-sky-500"
        onClick={() => router.back()}
      >
        <DoubleArrowLeftIcon className="dark:text-sky-500 text-sky-500 mr-1" />
        back
      </Button> */}
      <DetailCard postId={postId} post={post} />

      {/* Drawer for comment form and comment cards */}
      <PostDetailDrawer post={post} />
    </>
  );
};

export default PostDetailPage;

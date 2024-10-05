"use client";

import { useRouter } from "next/navigation";

import { DetailCard } from "@/components/cards/DetailCard";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import PostDetailDrawer from "@/components/ui/PostDetailDrawer";
import React, { useEffect, useState } from "react";

import { DoubleArrowLeftIcon } from "@radix-ui/react-icons";

const PostDetail = ({ params }: { params: { postId: string } }) => {
  const router = useRouter();
  const { postId } = params;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("about to fetch");
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Button
        variant={"link"}
        className="dark:text-sky-500"
        onClick={() => router.back()}
      >
        <DoubleArrowLeftIcon className="dark:text-sky-500 text-sky-500 mr-1" />
        back
      </Button>
      <DetailCard />

      {/* Drawer for comment form and comment cards */}
      <PostDetailDrawer />
    </>
  );
};

export default PostDetail;

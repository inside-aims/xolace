"use client";
import React, { useEffect } from "react";

import { PostCard } from "@/components/cards/PostCard";
import Loader from "@/components/shared/Loader";

const Feed = () => {
  //   const {
  //     data: posts,
  //     isLoading: isPostLoading,
  //     isError: isErrorPosts,
  //   } = useGetRecentPosts();

  const isPostLoading = false;

  return (
    <>
      {isPostLoading ? (
        <Loader />
      ) : (
        <ul className="flex flex-col flex-1 gap-3 w-full ">
          <li key={"post.$id"} className="flex justify-center w-full">
            <PostCard post={{}} />
          </li>
          <li key={"post.$id"} className="flex justify-center w-full">
            <PostCard post={{}} />
          </li>
          <li key={"post.$id"} className="flex justify-center w-full">
            <PostCard post={{}} />
          </li>
          <li key={"post.$id"} className="flex justify-center w-full">
            <PostCard post={{}} />
          </li>
        </ul>
      )}
    </>
  );
};

export default Feed;

{
  /* <RadioGroup defaultValue="comfortable" className=' flex' >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" className=' w-20 h-20 bg-white'  >
          <RocketIcon className="mr-2 h-10 w-10 text-red-400" />
        </RadioGroupItem>
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup> */
}

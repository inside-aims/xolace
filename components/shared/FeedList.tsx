import React from "react";
import { PostCard } from "@/components/cards/PostCard";

const FeedList = () => {
  return (
    <>
      <ul className="flex flex-col flex-1 gap-3 w-full ">
        <li key={"post.$id"} className="flex justify-center w-full ">
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
    </>
  );
};

export default FeedList;

import React, { Suspense } from "react";

import Loader from "@/components/shared/Loader";
import FeedList from "@/components/shared/FeedList";

export const dynamic = "force-dynamic";

const Feed = () => {
  return (
    <>
      {" "}
      <Suspense fallback={<Loader />}>
        <FeedList />
      </Suspense>
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

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Badge } from "../ui/badge";

interface TagCardProps {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  handleRemove?: () => void;
  isButton?: boolean;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove,
}: TagCardProps) => {
  //const iconClass = getDeviconClassName(name);

  const Content = (
    <>
      <Badge className=" text-[10px] font-medium leading-[13px] bg-light-2 dark:bg-black text-black dark:text-white  rounded-md border-none px-2 py-4 uppercase">
        <span className=" flex-center mr-1 space-x-3">
         
         {/* put icon here  */}
          <span>{name}</span>
        </span>

        {remove && (
          <Image
            src="/assets/close.svg"
            alt="close"
            width={12}
            height={12}
            className="cursor-pointer object-contain invert-0 dark:invert"
            onClick={handleRemove}
          />
        )}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </>
  );

  if (compact) {
    return isButton ? (
      <button type="button" className="flex items-center justify-between gap-2">
        {Content}
      </button>
    ) : (
      <Link href={`/tag/${_id}`} className=" flex justify-between gap-2">
        {Content}
      </Link>
    );
  }
};

export default TagCard;

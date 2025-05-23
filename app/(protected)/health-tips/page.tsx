

import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";
import {CircleArrowRight} from "lucide-react";
import React from "react";
import {healthTips} from "@/app/(protected)/health-tips/(overview)/health-tips";
import Link from 'next/link'
import {Preview} from "@/components/editor/Preview";

export default function HealthTips(){

  const truncateText = (words: string | string[], limit = 150): string => {
    // Ensure words is treated as a string by joining if it's an array
    const text = Array.isArray(words) ? words.join(' ') : words;

    if (text.length <= limit) {
      return text;
    }
    return text.slice(0, limit) + '...';
  };

  return(
    <HealthTipsWrapper>
      <div className={"flex flex-col w-full items-start gap-4 -mt-5 max-md:pb-6"}>
        <div className={"font-semibold text-2xl md:text-3xl px-4 mb-2"}>
          Xolace Wellness Insight
        </div>
        <div className={`flex flex-col w-full px-4 gap-4 md:gap-8`}>
          { healthTips.map((tip) => (
            <div className={"flex w-full items-start flex-col gap-2"} key={tip?.id}>
              <div className={"flex flex-col gap-1"}>
                <h3 className={"font-semibold text-lg md:text-xl"}>
                  {tip.title}
                </h3>
                <div className={"flex flex-row gap-2 text-sm text-neutral-500"}>
                  by
                  <span className={"text-lavender-500"}>
                  {tip.author}
                </span>
                  <span>{tip.date}</span>
                </div>
              </div>

              <div className={""}>
                {/* {truncateText(tip.content)} */}
                {typeof truncateText(tip.content) === "string" && (
                  <Preview content={truncateText(tip.content)}/>
                )}
              </div>
              <Link
                href={`/health-tips/${tip.id}`}
                className={"flex text-sm items-center text-lavender-400 hover:text-lavender-600 hover:underline hover:cursor-pointer hover:lavender-500"}
              >
                Read more
                <span className={"text-lavender-400 hover:lavender-500 ml-1"}>
                 <CircleArrowRight size={16}/>
               </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </HealthTipsWrapper>
  )
}
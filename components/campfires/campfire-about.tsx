'use client';

import {Globe, TicketCheck} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import React from "react";

const rules: { id: string; question: string; answer: string }[] = [
  { id: "rule-1", question: "Follow community guidelines", answer: "Always follow the rules and respect other members." },
  { id: "rule-2", question: "No hate speech or bullying", answer: "We have zero tolerance for hate speech or personal attacks." },
  { id: "rule-3", question: "Stay on topic", answer: "All posts should be related to Ghana and its community." },
  { id: "rule-4", question: "No spam or self-promotion", answer: "Do not spam links, ads, or unrelated promotions." },
  { id: "rule-5", question: "Use descriptive titles", answer: "Make sure your post titles clearly reflect the content." },
];

const CampfireAbout = () => {

  return (
    <div
      className="flex items-start flex-col border py-4 gap-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-sm text-neutral-500 dark:text-neutral-300">
      <div className="flex items-start flex-col gap-4 px-2 py-2">
        <h2 className={"uppercase font-semibold"}>About campfire</h2>
        <p className="flex flex-col gap-1 ">
          <span className={"font-semibold"}> Community dedicated for ghana and related news</span>
          <span>This is sub news for all Ghana and related activities campfire post.</span>
        </p>
        <p className="flex flex-col gap-1">
        <span className={"flex items-center flex-row gap-1"}>
        <TicketCheck size={16}/> Created Jun 22, 2011
        </span>
          <span className={"flex items-center flex-row gap-1"}>
        <Globe size={16}/> Public
          </span>
        </p>
        <Button
          size={"sm"}
          variant={"outline"}
          className={"w-full items-center bg-neutral-300 dark:bg-neutral-900 border border-neutral-400 rounded-full"}
        >
          Campfire Guide
        </Button>
        <div className={"w-full flex flex-row items-center justify-between text-xs"}>
          <p className={"flex flex-col items-start"}>
            98K
            <span>Members</span>
          </p>
          <p className={"flex flex-col items-start"}>
            35
            <span>online</span>
          </p>
          <p className={"flex flex-col items-start"}>
            Top 2%
            <span>
            Rank by size
          </span>
          </p>
        </div>
      </div>
      <Separator className="bg-neutral-300 dark:bg-neutral-200"/>
      <div className={"flex flex-col gap-4 py-2 px-4"}>
        <h2 className={"uppercase font-semibold"}>user flair</h2>
        <p className={"flex flex-row gap-2 items-center"}>
          <span className={"w-8 h-8 bg-neutral-300 rounded-full"}>
          </span>
          <span>
            user-flair-394
          </span>
        </p>
      </div>
      <Separator className="bg-neutral-300 dark:bg-neutral-200"/>
      <div className={"flex flex-col gap-4 py-2 px-4"}>
        <h2 className={"uppercase font-semibold"}>r/ghana rules</h2>
        <Accordion type="single" collapsible className="w-full">
          {rules.map((rule, index) => (
            <AccordionItem
              value={rule.id}
              key={rule.id}
              className={`px-2 py-1 border-none hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors`}
            >
              <AccordionTrigger className="flex items-center justify-between gap-2 py-1">
                <span className="flex items-start font-bold mr-2">{index + 1}.</span>
                <span className="flex-1 text-left">{rule.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-2">
                {rule.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default CampfireAbout;
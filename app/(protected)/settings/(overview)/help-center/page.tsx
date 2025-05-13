'use client';

import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import { helpFaqs } from "@/constants";
import GetInTouchDialog from "@/app/(protected)/settings/(overview)/help-center/GetInTouchDialog";



export default function HelpCenterPage() {
  return (
    <>
      <div className='w-full flex items-center flex-col md:hidden'>
        <HelpCenterContent/>
      </div>
      <div className="w-full hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <HelpCenterContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

const HelpCenterContent = () =>{
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredFaq = searchTerm.trim() ?
    helpFaqs.filter(
      option =>
        option.question.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : helpFaqs;

  return(
    <SettingsNavigationWrapper title={'Help Center'}>
      <div className={"w-full flex flex-col items-center justify-center gap-8 px-4 pb-18"}>
        <div className={"w-full md:w-[80%] flex flex-col items-center justify-center gap-2"}>
          <h3 className={"text-2xl"}>
            How can we help you?
          </h3>
          <div className="relative w-full shadow-lg border">
              <span className="absolute inset-y-0 start-0 flex items-center ps-4">
                <Search className="w-4 h-4 text-muted-foreground"/>
              </span>
            <Input
              type="text"
              name="searchInput"
              placeholder="Describe your issue here"
              className="rounded-none py-6 ps-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/*help center xolace questions*/}
        <div className={"flex flex-col w-full items-start gap-1"}>
          <h5 className={"ps-2"}>
            Browse help topics
          </h5>
          <div className={"flex w-full border rounded-2xl"}>
            <Accordion type="single" collapsible className={"w-full"}>
              {filteredFaq.map((faq, index) => (
                <AccordionItem
                  value={faq.id}
                  key={faq.id}
                  className={`${index === filteredFaq.length - 1 && "border-none"} px-2 md:px-8`}
                >
                  <AccordionTrigger>
                    { faq.question }
                  </AccordionTrigger>
                  <AccordionContent>
                    { faq.answer }
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        {/*still have questions*/}
        <div className={"flex flex-col w-full items-start gap-1"}>
          <div className="mx-auto flex h-[200px] w-full flex-col items-center justify-center rounded-2xl border bg-ocean-100 gap-2 text-white">
            <p className="relative flex p-4">
                <span className="absolute -left-6 top-0 z-10 h-8 w-8 rounded-full bg-[#ABB677]">
                </span>
              <span className="absolute -top-0.5 left-1/2 z-20 h-9 w-9 -translate-x-1/2 transform rounded-full bg-[#C7B9DA]">
              </span>
              <span className="absolute -right-6 top-0 z-10 h-8 w-8 rounded-full bg-[#D9B9BB]">
              </span>
            </p>
            <p className="flex items-center justify-center font-sans text-lg text-[#28220C]">
              Still have questions?
            </p>
            <p className="text-pretty text-center text-sm text-black">
              Can&apos;t find the answer you&apos;re looking for? Please chat to our
              friendly team.
            </p>
            <GetInTouchDialog/>
        </div>
      </div>
    </div>
</SettingsNavigationWrapper>
)
}
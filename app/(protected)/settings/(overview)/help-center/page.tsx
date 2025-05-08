'use client';

import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";

const faqs: { id: string, question: string, answer: string }[] = [
  {
    id: "1",
    question: "How does Xolace protect my anonymity?",
    answer: "Xolace uses advanced privacy techniques to ensure your identity remains hidden. No personal details are attached to anonymous posts."
  },
  {
    id: "2",
    question: "Can I switch from anonymous to public mode when posting?",
    answer: "Yes, you can choose to post either anonymously or publicly by toggling the visibility option before submitting your post."
  },
  {
    id: "3",
    question: "How do I report a harmful or abusive post?",
    answer: "Click the 'Report' button next to the post and choose a reason. Our moderation team will review it within 24 hours."
  },
  {
    id: "4",
    question: "Can other users see my profile details when I post anonymously?",
    answer: "No. When you post anonymously, your profile details are completely hidden from other users."
  },
  {
    id: "5",
    question: "How do I reset my password on Xolace?",
    answer: "Go to the login page, click on 'Forgot password?', and follow the instructions to reset it using your email."
  },
  {
    id: "6",
    question: "Is my data shared with third parties?",
    answer: "No, Xolace does not sell or share your personal data with third parties. We are committed to user privacy."
  },
  {
    id: "7",
    question: "How can I delete my account permanently?",
    answer: "Go to 'Settings' > 'Account' > 'Delete Account'. Follow the confirmation steps to permanently remove your data from Xolace."
  },
  {
    id: "8",
    question: "What kind of content can I post on Xolace?",
    answer: "You can share thoughts, questions, or experiences. However, harmful, explicit, or illegal content is strictly prohibited."
  }
];

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
    faqs.filter(
      option =>
        option.question.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : faqs;

  return(
    <SettingsNavigationWrapper title={'Help Center'}>
      <div className={"w-full flex flex-col items-center justify-center gap-8 px-4 pb-18 pb-8"}>
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
            <p className="text-pretty text-center text-sm text-[#28220C]">
              Can’t find the answer you’re looking for? Please chat to our
              friendly team.
            </p>
            <Button className={"bg-lavender-500 hover:bg-lavender-600 px-[8%] transition-transform duration-300 ease-in-out hover:scale-110 text-white"}>Get in touch</Button>
        </div>
      </div>
    </div>
</SettingsNavigationWrapper>
)
}
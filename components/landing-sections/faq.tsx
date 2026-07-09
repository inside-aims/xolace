"use client";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import ContactUsForm from "@/components/landing-sections/contact-us-form";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is Xolace?",
    answer:
      "Xolace is a free emotional wellness app that gives you a quiet, private space to name what you feel — even when you don’t have the words for it yet. It’s not therapy. It’s not a social platform. It’s the space before, between, and outside all of those.",
    value: "item-1",
  },
  {
    question: "Who is this for?",
    answer:
      "Xolace is for anyone who has ever felt something they couldn’t name, or carried something they couldn’t say out loud. You don’t need to be in crisis, and you don’t need to have it figured out. You just need to show up.",
    value: "item-3",
  },
  {
    question: "Is it really anonymous?",
    answer:
      "Yes. Your name is never attached to what you feel. You are not profiled or tracked based on what you share. Everything is encrypted in transit and at rest, and no one on the Xolace team reads your sessions.",
    value: "item-4",
  },
  {
    question: "How does Mirror work?",
    answer:
      "You type a word, a fragment, or speak out loud — whatever you can manage. Mirror reflects back structured emotional language to help you understand what you’re feeling. No clinical vocabulary required. No journaling expertise needed.",
    value: "item-5",
  },
  {
    question: "Is Xolace free?",
    answer:
      "Yes. Xolace is free to download and your first session takes about 3 minutes. The core experience is always free.",
    value: "item-6",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="section">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - FAQ Accordion */}
          <div className={"flex flex-col gap-4"}>
            <div className={"section-parent-header gap-4"}>
              <h2 className="text-lg text-primary tracking-wider font-semibold">
                FAQ
              </h2>
              <h1 className="section-header">
                Everything you&apos;d want to know before you trust a space like
                this
              </h1>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {FAQList.map(({ question, answer, value }, index) => (
                <div key={value}>
                  <AccordionItem value={value} className="border-none">
                    <AccordionTrigger className="text-left hover:no-underline py-4 px-0 text-xl md:text-2xl font-semibold hover:text-primary transition-colors [&[data-state=open]>svg]:rotate-45">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="flex-1">{question}</span>
                        <Plus className="h-6 w-6 text-primary shrink-0 transition-transform duration-300" />
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="text-muted-foreground pb-5 pt-2 text-base leading-relaxed">
                      {answer}
                    </AccordionContent>
                  </AccordionItem>
                  {index < FAQList.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </Accordion>
          </div>

          {/* Right side - contact us form */}
          <div className="relative w-full overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/15 to-primary/15 blur-2xl opacity-60 pointer-events-none" />
            <div className="relative bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
              <Suspense fallback={<div className="p-6">Loading form...</div>}>
                <ContactUsForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

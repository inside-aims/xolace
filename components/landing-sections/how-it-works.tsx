"use client";


import {DownloadButtons} from "@/components/shared/layoutUIs/download-buttons";

const features = [
  {
    id: "mirror",
    number: "01",
    name: "Mirror",
    subheading: "Words for what you couldn't say",
    description:
      "Type a fragment. Speak out loud. Mirror reflects back structured emotional language so you can name what you're carrying.",
  },
  {
    id: "echo",
    number: "02",
    name: "Echo",
    subheading: "Someone else carried this too",
    description:
      "After Mirror, Echo surfaces anonymous moments from others who felt something similar. Not advice — just proof you were never alone in this.",
  },
  {
    id: "safety",
    number: "03",
    name: "Safety",
    subheading: "Held, even when it's heavier",
    description:
      "When something you share suggests danger, Xolace responds gently — and connects you with real help.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="howItWorks" className="section">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 md:mb-20">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-5">
            How it works
          </p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Three quiet things
          </h2>
          <p className="text-muted-foreground text-xl mt-4 max-w-md">
            You don&apos;t have to know what you&apos;re feeling to begin.
          </p>
        </div>

        <div className="divide-y divide-border">
          {features.map(({ id, number, name, subheading, description }) => (
            <div
              key={id}
              className="py-10 md:py-14 grid grid-cols-1 md:grid-cols-[100px_1fr_1fr] gap-6 md:gap-12 items-start group"
            >
              <span className="text-5xl md:text-8xl font-bold text-foreground/10 group-hover:text-primary/15 transition-colors duration-700 leading-none select-none">
                {number}
              </span>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">
                  {name}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold leading-snug">
                  {subheading}
                </h3>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed md:pt-8">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 md:mt-20 flex flex-col gap-8 md:flex-row md:items-center md:justify-between border-t border-border pt-10 md:pt-12">
          <p className="text-base md:text-lg text-muted-foreground italic max-w-lg">
            &ldquo;Not therapy. Not a chatbot. Not a social platform. The space
            before, between, and outside all of those.&rdquo;
          </p>
          <DownloadButtons align="start" />
        </div>
      </div>
    </section>
  );
}

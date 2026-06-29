"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import {DownloadButtons} from "@/components/shared/layoutUIs/download-buttons";

const reviews = [
  {
    id: "r1",
    initials: "SK",
    name: "S.K.",
    time: "2:14 AM",
    rating: 5,
    quote:
      "I didn't expect to cry. I just typed something I'd been carrying for months and it… understood. Not in a robotic way. In a human way.",
  },
  {
    id: "r2",
    initials: "AM",
    name: "A.M.",
    time: "11:08 PM",
    rating: 5,
    quote:
      "No sign-up pressure. No profile. I just opened it and felt like I could breathe for a second.",
  },
  {
    id: "r3",
    initials: "DO",
    name: "D.O.",
    time: "1:22 AM",
    rating: 5,
    quote:
      "The Echo feature broke me open in the best way. Knowing someone else felt exactly this, at 1am, alone — that changed something.",
  },
  {
    id: "r4",
    initials: "LT",
    name: "L.T.",
    time: "9:45 PM",
    rating: 5,
    quote:
      "I've tried journaling apps. This is different. It doesn't ask me to perform wellness. It just holds what I bring.",
  },
  {
    id: "r5",
    initials: "MF",
    name: "M.F.",
    time: "11:38 PM",
    rating: 5,
    quote:
      "Three minutes. That's all it took to feel less alone than I had in weeks.",
  },
];

export const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const getCardStyle = (index: number) => {
    const diff = (index - currentIndex + reviews.length) % reviews.length;

    if (diff === 0) {
      return {
        transform: "translateX(0%) translateY(0%) scale(1) rotate(0deg)",
        opacity: 1,
        zIndex: 30,
      };
    }
    if (diff === 1) {
      return {
        transform: "translateX(55%) translateY(6%) scale(0.93) rotate(6deg)",
        opacity: 0.5,
        zIndex: 20,
      };
    }
    if (diff === reviews.length - 1) {
      return {
        transform: "translateX(-55%) translateY(6%) scale(0.93) rotate(-6deg)",
        opacity: 0.5,
        zIndex: 20,
      };
    }
    return {
      transform: "translateX(0%) translateY(18%) scale(0.86)",
      opacity: 0,
      zIndex: 10,
    };
  };

  return (
    <section id="testimonials" className="section">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
              Real voices
            </p>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              What they found
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={`star-${i}`}
                  className="w-4 h-4 fill-primary text-primary"
                />
              ))}
            </div>
            <span className="font-bold text-lg">4.9</span>
            <span className="text-muted-foreground text-sm">
              · App Store &amp; Google Play
            </span>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative h-[480px] md:h-[420px] flex items-center justify-center overflow-hidden">
          <button
            onClick={prev}
            type="button"
            className="absolute left-0 md:left-2 z-40 w-11 h-11 rounded-full bg-background border border-border shadow hover:shadow-md transition-all flex items-center justify-center hover:scale-105"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={next}
            type="button"
            className="absolute right-0 md:right-2 z-40 w-11 h-11 rounded-full bg-background border border-border shadow hover:shadow-md transition-all flex items-center justify-center hover:scale-105"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="absolute w-full max-w-xl transition-all duration-700 ease-out"
                style={getCardStyle(index)}
              >
                <div className="bg-card rounded-2xl border shadow-xl p-8 md:p-10 min-h-[360px] flex flex-col gap-6">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={`${review.id}-star-${i}`}
                        className="w-4 h-4 fill-primary text-primary"
                      />
                    ))}
                  </div>

                  <p className="text-xl md:text-2xl font-medium leading-relaxed grow">
                    &ldquo;{review.quote}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {review.initials}
                      </div>
                      <span className="font-semibold text-sm">
                        {review.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {review.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-2">
          {reviews.map(({ id }, index) => (
            <button
              key={id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6 italic">
          Every word here is real.
        </p>

        <div className="mt-8 flex justify-center">
          <DownloadButtons />
        </div>
      </div>
    </section>
  );
};

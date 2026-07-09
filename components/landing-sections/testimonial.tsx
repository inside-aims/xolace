'use client';

import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useState } from 'react';
import { DownloadButtons } from '@/components/shared/layoutUIs/download-buttons';

const reviews = [
  {
    id: 'r1',
    initials: 'SK',
    name: 'S.K.',
    time: '2:14 AM',
    rating: 5,
    quote:
      "I didn't expect to cry. I just typed something I'd been carrying for months and it… understood. Not in a robotic way. In a human way.",
  },
  {
    id: 'r2',
    initials: 'CJ',
    name: 'Christopher',
    time: '11:08 PM',
    rating: 5,
    quote:
      'Xolace gave me a space to express myself freely and reflect on my emotions without pressure. I like how calm, simple, and peaceful the experience feels.',
  },
  {
    id: 'r3',
    initials: 'DO',
    name: 'D.O.',
    time: '1:22 AM',
    rating: 5,
    quote:
      'The Echo feature broke me open in the best way. Knowing someone else felt exactly this, at 1am, alone — that changed something.',
  },
  {
    id: 'r4',
    initials: 'ER',
    name: 'Erica',
    time: '9:45 PM',
    rating: 5,
    quote:
      'I love how Xolace created a safe and comfortable space for me to express myself and feel understood.',
  },
  {
    id: 'r5',
    initials: 'SK',
    name: 'S-kvng',
    time: '11:38 PM',
    rating: 5,
    quote:
      "Sometimes I'm blown away by how easy it is to gain clarity on how I'm feeling without needing to have a conversation.",
  },
  {
    id: 'r6',
    initials: 'LT',
    name: 'L.T.',
    time: '8:23 PM',
    rating: 5,
    quote:
      "I've tried journaling apps. This is different. It doesn't ask me to perform wellness. It just holds what I bring.",
  },
  {
    id: 'r7',
    initials: 'RO',
    name: 'Rosiee',
    time: '10:15 PM',
    rating: 5,
    quote:
      "Just a few days on Xolace and I've realized that I don't really need a lot of words to express myself.",
  },
];

export const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex(prev => (prev + 1) % reviews.length);
  const prev = () =>
    setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length);

  const getCardStyle = (index: number) => {
    const diff = (index - currentIndex + reviews.length) % reviews.length;

    if (diff === 0) {
      return {
        transform: 'translateX(0%) translateY(0%) scale(1) rotate(0deg)',
        opacity: 1,
        zIndex: 30,
      };
    }
    if (diff === 1) {
      return {
        transform: 'translateX(55%) translateY(6%) scale(0.93) rotate(6deg)',
        opacity: 0.5,
        zIndex: 20,
      };
    }
    if (diff === reviews.length - 1) {
      return {
        transform: 'translateX(-55%) translateY(6%) scale(0.93) rotate(-6deg)',
        opacity: 0.5,
        zIndex: 20,
      };
    }
    return {
      transform: 'translateX(0%) translateY(18%) scale(0.86)',
      opacity: 0,
      zIndex: 10,
    };
  };

  return (
    <section id="testimonials" className="section">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-primary mb-4 text-xs font-semibold tracking-[0.2em] uppercase">
              Real voices
            </p>
            <h2 className="text-4xl leading-tight font-bold md:text-6xl">
              What they found
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={`star-${i}`}
                  className="fill-primary text-primary h-4 w-4"
                />
              ))}
            </div>
            <span className="text-lg font-bold">4.9</span>
            <span className="text-muted-foreground text-sm">
              · App Store &amp; Google Play
            </span>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative flex h-[480px] items-center justify-center overflow-hidden md:h-[420px]">
          <button
            onClick={prev}
            type="button"
            className="bg-background border-border absolute left-0 z-40 flex h-11 w-11 items-center justify-center rounded-full border shadow transition-all hover:scale-105 hover:shadow-md md:left-2"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={next}
            type="button"
            className="bg-background border-border absolute right-0 z-40 flex h-11 w-11 items-center justify-center rounded-full border shadow transition-all hover:scale-105 hover:shadow-md md:right-2"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="relative flex h-full w-full max-w-2xl items-center justify-center">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="absolute w-full max-w-xl transition-all duration-700 ease-out"
                style={getCardStyle(index)}
              >
                <div className="bg-card flex min-h-[360px] flex-col gap-6 rounded-2xl border p-8 shadow-xl md:p-10">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={`${review.id}-star-${i}`}
                        className="fill-primary text-primary h-4 w-4"
                      />
                    ))}
                  </div>

                  <p className="grow text-xl leading-relaxed font-medium md:text-2xl">
                    &ldquo;{review.quote}&rdquo;
                  </p>

                  <div className="border-border flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold">
                        {review.initials}
                      </div>
                      <span className="text-sm font-semibold">
                        {review.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground font-mono text-xs">
                      {review.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-2 flex justify-center gap-2">
          {reviews.map(({ id }, index) => (
            <button
              key={id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        <p className="text-muted-foreground mt-6 text-center text-sm italic">
          Every word here is real.
        </p>

        <div className="mt-8 flex justify-center">
          <DownloadButtons />
        </div>
      </div>
    </section>
  );
};

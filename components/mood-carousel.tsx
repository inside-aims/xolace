"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { postMoods } from "@/constants";
import { Mood } from "@/types";

type MoodCarouselProps = {
  selectedMood: Mood | null;
  setSelectedMood: Dispatch<SetStateAction<Mood | null>>;
};

export default function MoodCarousel({
  selectedMood,
  setSelectedMood,
}: MoodCarouselProps) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  });

  const getMoodStyle = (mood: Mood) => {
    if (selectedMood?.value === mood.value) {
      switch (mood.value) {
        case "neutral":
          return "border-zinc-600 bg-gray-500 text-white";
        case "happy":
          return "border-green-500 bg-green-400 text-white";
        case "sad":
          return "border-blue bg-blue text-white";
        case "angry":
          return "border-red-500 bg-red-400 text-white";
        case "confused":
          return "border-yellow-500 bg-yellow-400 text-white";
        default:
          return "border-zinc-400 bg-zinc-100 text-black";
      }
    }
    return "border-zinc-400 bg-zinc-100 text-black dark:border-zinc-700 dark:bg-transparent dark:text-white";
  };

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full  sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto !mt-1"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {postMoods.map((mood) => (
          <CarouselItem
            key={mood.id}
            className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4 lg:basis-1/5 p-1"
          >
            <Button
              type="button"
              className={`w-full py-1 flex flex-col items-center justify-center rounded-3xl border dark:bg-transparent ${getMoodStyle(mood)}`}
              onClick={() => setSelectedMood(mood)}
            >
              <span className="text-sm sm:text-lg">{mood.icon}</span>
            </Button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

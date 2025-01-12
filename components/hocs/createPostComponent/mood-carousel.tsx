'use client';

import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
//import useEmblaCarousel from 'embla-carousel-react';
import { postMoods } from '@/constants';
import { Mood } from '@/types';
import Image from 'next/image';

type MoodCarouselProps = {
  selectedMood: Mood | null;
  setSelectedMood: Dispatch<SetStateAction<Mood | null>>;
};

export default function MoodCarousel({
  selectedMood,
  setSelectedMood,
}: MoodCarouselProps) {
  // const [emblaRef] = useEmblaCarousel({
  //   align: 'start',
  //   slidesToScroll: 1,
  //   breakpoints: {
  //     '(min-width: 640px)': { slidesToScroll: 2 },
  //     '(min-width: 1024px)': { slidesToScroll: 3 },
  //   },
  // });

  const getMoodStyle = (mood: Mood) => {
    if (selectedMood?.value === mood.value) {
      switch (mood.value) {
        case 'neutral':
          return 'border-pink-500 bg-transparent text-white';
        case 'happy':
          return 'border-green-500 bg-green-400 text-white';
        case 'sad':
          return 'border-blue bg-blue text-white';
        case 'angry':
          return 'border-red-500 bg-red-400 text-white';
        case 'confused':
          return 'border-yellow-500 bg-yellow-400 text-white';
        default:
          return 'border-zinc-400 bg-zinc-100 text-black';
      }
    }
    return 'border-zinc-400 bg-zinc-100 text-black dark:border-zinc-700 dark:bg-transparent dark:text-white';
  };

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="xl:max-w-2xl mx-auto !mt-1 w-full sm:max-w-md md:max-w-lg lg:max-w-xl"
    >
      <CarouselContent className="ml-1 md:-ml-4">
        {postMoods.map(mood => (
          <CarouselItem
            key={mood.id}
            className="basis-1/3 p-1 pl-2 sm:basis-1/4 md:pl-4 lg:basis-1/5"
          >
            <Button
              type="button"
              className={`flex w-full flex-col items-center justify-center rounded-3xl border py-1 dark:bg-transparent ${getMoodStyle(mood)}`}
              onClick={() => setSelectedMood(mood)}
            >
              {mood.gif ? (
                <span>
                  <Image
                    src={mood.gif}
                    alt="Sad Emoji"
                    width={24}
                    height={24}
                    className="h-6 sm:h-7 sm:w-7"
                  />
                </span>
              ) : (
                <span className="text-sm sm:text-lg">{mood.icon}</span>
              )}
            </Button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious type="button" />
      <CarouselNext type="button" />
    </Carousel>
  );
}

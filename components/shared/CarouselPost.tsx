'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Pagination,
  Parallax,
  EffectCoverflow,
  Autoplay,
} from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/parallax';
import 'swiper/css/effect-coverflow';

interface CarouselPostProps {
  slides: { content: string; slide_index: number }[]; // array of objects
  postId: string;
  onClick?: () => void;
}

export default function CarouselPost({
  slides,
  postId,
  onClick,
}: CarouselPostProps) {
  if (!slides || slides.length === 0) return null;

  console.log(slides);

  return (
    <div className="group relative w-full lg:w-2/3">
      <Swiper
        modules={[Navigation, Pagination, Parallax, EffectCoverflow, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          prevEl: `.swiper-button-prev-${postId}`,
          nextEl: `.swiper-button-next-${postId}`,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          bulletClass: `swiper-pagination-bullet-${postId}`,
          bulletActiveClass: `swiper-pagination-bullet-active-${postId}`,
        }}
        parallax={true}
        effect="coverflow"
        coverflowEffect={{
          rotate: 15,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={slides.length > 1}
        className="carousel-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative min-h-[120px] overflow-hidden rounded-2xl bg-gradient-to-br dark:from-bg-dark dark:via-bg-dark dark:to-bg-dark p-4 shadow-inner"
              data-swiper-parallax="-100"
              onClick={onClick}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 h-20 w-20 rounded-full bg-purple-300 blur-xl"></div>
                <div className="absolute right-4 bottom-4 h-16 w-16 rounded-full bg-pink-300 blur-lg"></div>
                <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-200 blur-2xl"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-lavender-100 py-1 px-1 text-xs font-medium text-lavender-600">
                    Slide {slide.slide_index + 1} of {slides.length}
                  </span>
                </div>
                <p
                  className="text-content-label leading-relaxed dark:text-gray-200"
                  data-swiper-parallax="-200"
                >
                  {slide.content}
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-orange-300 to-orange-200 opacity-20"></div>
              {/* <div className="absolute -bottom-2 -left-2 h-14 w-14 animate-bounce rounded-full bg-gradient-to-br from-teal-200 to-teal-200 opacity-30"></div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <button
        className={`swiper-button-prev-${postId} absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-white`}
      >
        <ChevronLeft className="h-5 w-5 text-gray-700" />
      </button>
      <button
        className={`swiper-button-next-${postId} absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-white`}
      >
        <ChevronRight className="h-5 w-5 text-gray-700" />
      </button>

      <style jsx global>{`
        .carousel-swiper .swiper-pagination {
          bottom: -40px !important;
        }

        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: #e5e7eb;
          opacity: 1;
          margin: 0 6px;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active-custom {
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          transform: scale(1.2);
        }

        .carousel-swiper .swiper-slide {
          transition: all 0.3s ease;
        }

        .carousel-swiper .swiper-slide:not(.swiper-slide-active) {
          opacity: 0.7;
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}

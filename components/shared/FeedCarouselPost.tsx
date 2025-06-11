import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules"
import { ArrowRight, ArrowLeft } from "lucide-react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/parallax"
import "swiper/css/effect-coverflow"
import { Post } from "@/types/global"
import { truncateText } from "@/lib/utils"

interface CarouselPostProps {
    slides: { content: string , slide_index: number }[]  // array of objects
    postId: string,
    onClick?: () => void
  }
const FeedCarouselPost = ({ slides, postId, onClick }: CarouselPostProps) => {
    console.log(slides)
  return (
    <div className="mb-4">
    {/* Enhanced Swiper Carousel */}
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6">
      <Swiper
        modules={[Navigation, Pagination, EffectCoverflow]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          prevEl: `.swiper-button-prev-${postId}`,
          nextEl: `.swiper-button-next-${postId}`,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          el: `.swiper-pagination-custom`,
        }}
        effect="coverflow"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        className="h-auto"
      >
        {slides?.map((slide, index) => (
          <SwiperSlide key={index}>
            <div onClick={onClick} className="bg-card rounded-lg p-6 shadow-sm border border-border/50 min-h-[120px] flex items-center">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap text-center w-full">
                {truncateText(slide.content, 200)}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {slides && slides.length > 1 && (
        <>
          <button
            className={`swiper-button-prev-${postId} absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center group`}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-purple-500" />
          </button>
          <button
            className={`swiper-button-next-${postId} absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center group`}
          >
            <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-purple-500" />
          </button>
        </>
      )}

      {/* Custom Pagination */}
      {slides && slides.length > 1 && (
        <div className={`swiper-pagination-custom !bottom-2 !left-1/2 !transform !-translate-x-1/2`} />
      )}
    </div>
  </div>
)}

export default FeedCarouselPost
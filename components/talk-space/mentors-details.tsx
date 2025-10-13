import {Heart} from "lucide-react";
import React from "react";
import {
  MentorAchievements,
  MentorActions, MentorAvailability,
  MentorAvatar,
  MentorBadges, MentorBio, MentorFeatures, MentorLanguages, MentorPricingEnhanced, MentorProps,
  MentorRating, MentorSpecializations, MentorStats, MentorTags
} from "@/components/talk-space/mentors-card";


interface MentorCardProps {
  mentor: MentorProps;
  isFavorite: boolean;
  onToggleFavorite: (mentorId: string) => void;
  onStartChart: () => void;
  onReadMore?: () => void;
}

const MentorsDetails = ({ mentor, isFavorite, onToggleFavorite, onReadMore, onStartChart }: MentorCardProps) => {
  return (
    <div
      className="group transition-all duration-500 overflow-hidden transform hover:-translate-y-2 px-0 md:px-3">
      {/* Cover */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={mentor.coverImage}
          height={32}
          width={32}
          alt=""
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"/>

        <MentorBadges isVerified={mentor.isVerified} isPro={mentor.isPro}/>

        <button
          onClick={() => onToggleFavorite(mentor.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
        >
          <Heart
            size={18}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>
      </div>

      <MentorAvatar
        avatar={mentor.avatar}
        name={mentor.name}
        isOnline={mentor.isOnline}
      />

      <div className="pt-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-400">{mentor.name}</h3>
            <p className="text-indigo-600 font-medium text-sm">@{mentor.username}</p>
          </div>
          <span className="text-3xl">{mentor.country}</span>
        </div>

        <p className="text-gray-700 dark:text-gray-200 font-semibold mb-3">{mentor.specialty}</p>
        <MentorRating rating={mentor.rating} reviewCount={mentor.reviewCount} />
        <MentorStats
          mentees={mentor.mentees}
          sessions={mentor.sessions}
          experience={mentor.experience}
        />

        <MentorBio bio={mentor.bio} />

        <MentorFeatures
          responseTime={mentor.responseTime}
          instantBooking={mentor.instantBooking}
          videoCallAvailable={mentor.videoCallAvailable}
        />
        <MentorLanguages languages={mentor.languages} />
        <MentorAvailability availability={mentor.availability} />
        <MentorSpecializations specializations={mentor.specializations} />
        <MentorAchievements achievements={mentor.achievements} />
        <MentorTags tags={mentor.tags} />
        <MentorPricingEnhanced pricing={mentor.pricing} />
        <MentorActions onStartChart={onStartChart} onReadMore={onReadMore} />
      </div>
    </div>
  )
}
export default MentorsDetails;
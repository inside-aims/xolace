'use client';

import {
  CheckCircle, Award, Heart, User, MessageCircle, Calendar, Star,
  Clock, Video, Zap, ChevronRight, Globe, Sparkles
} from 'lucide-react';
import React from "react";


interface FeatureProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
  color: string;
  bg: string;
}

interface StatCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bg: string;
  value: string | number;
  label: string;
}

export interface MentorProps {
  id: string;
  name: string;
  username: string;
  country: string;
  coverImage: string;
  avatar: string;
  isOnline: boolean;
  isVerified: boolean;
  isPro: boolean;
  specialty: string;
  rating: number;
  category: string;
  languages: string[];
  availability: string;
  reviewCount: number;
  specializations: string[];
  achievements: string[];
  mentees: number;
  sessions: number;
  experience: string;
  bio: string;
  videoCallAvailable: boolean;
  instantBooking: boolean;
  responseTime: string;
  tags: string[];
  pricing: {
    session: string;
    package: string;
  };
}

interface MentorCardProps {
  mentor: MentorProps;
  isFavorite: boolean;
  onToggleFavorite: (mentorId: string) => void;
  onStartChart: () => void;
  onReadMore?: () => void;
}

export default function MentorCard({ mentor, isFavorite, onToggleFavorite, onReadMore, onStartChart }: MentorCardProps) {
  return (
    <div className="group rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-gray-50">
      {/* Cover */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={mentor.coverImage}
          height={32}
          width={32}
          alt=""
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />

        <MentorBadges isVerified={mentor.isVerified} isPro={mentor.isPro} />

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

      <div className="px-6 pt-3 pb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-400">{mentor.name}</h3>
            <p className="text-indigo-600 font-medium text-sm">@{mentor.username}</p>
          </div>
          <span className="text-3xl">{mentor.country}</span>
        </div>

        <p className="text-gray-700 dark:text-gray-200 font-semibold mb-3">{mentor.specialty}</p>

        <MentorRating rating={mentor.rating} reviewCount={mentor.reviewCount} />
        <MentorPricing sessionRate={mentor.pricing.session} />
        <MentorActions onStartChart={onStartChart} onReadMore={onReadMore}/>
      </div>
    </div>
  );
}

export const MentorBadges = ({ isVerified, isPro }: { isVerified: boolean; isPro: boolean }) => (
  <div className="absolute top-3 left-3 flex gap-2">
    {isVerified && (
      <div className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
        <CheckCircle size={14} />
        Verified
      </div>
    )}
    {isPro && (
      <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
        <Award size={14} />
        PRO
      </div>
    )}
  </div>
);

export const MentorAvatar = ({ avatar, name, isOnline }: { avatar: string, name: string, isOnline?:boolean }) => (
  <div className="relative px-6 -mt-12">
    <div className="relative inline-block">
      {/*img will be change to next image - img is only for testing*/}
      <img
        src={avatar}
        alt={name}
        height={24}
        width={24}
        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl ring-2 ring-indigo-100"
      />
      {isOnline && (
        <span className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold border-2 border-white">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Online
        </span>
      )}
    </div>
  </div>
);

export const MentorRating = ({ rating, reviewCount }: { rating: number; reviewCount: number }) => (
  <div className="flex items-center gap-1.5 pb-4">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ))}
    <span className="text-sm font-bold text-gray-900">{rating}</span>
    <span className="text-sm text-gray-500 dark:text-white">({reviewCount})</span>
  </div>
);

export const MentorStats = ({ mentees, sessions, experience }: { mentees: number, sessions: number, experience: string }) => (
  <div className="grid grid-cols-3 gap-3 mb-4">
    <StatCard
      icon={User}
      color="text-indigo-600"
      bg="from-indigo-50 to-purple-50"
      value={mentees}
      label="Mentees"
    />
    <StatCard
      icon={MessageCircle}
      color="text-green-600"
      bg="from-green-50 to-emerald-50"
      value={sessions}
      label="Sessions"
    />
    <StatCard
      icon={Calendar}
      color="text-orange-600"
      bg="from-orange-50 to-red-50"
      value={experience}
      label="Experience"
    />
  </div>
);


export const StatCard = ({ icon: Icon, color, bg, value, label }: StatCardProps) => (
  <div className={`text-center p-3 bg-gradient-to-br ${bg} rounded-xl`}>
    <Icon size={18} className={`${color} mx-auto mb-1`} />
    <div className="font-bold text-gray-900">{value}</div>
    <div className="text-xs text-gray-600">{label}</div>
  </div>
);

export const MentorBio = ({ bio }: { bio: string }) => (
  <p className="text-gray-600 dark:text-white text-sm leading-relaxed mb-4 line-clamp-3">{bio}</p>
);

export const MentorFeatures = ({ videoCallAvailable, instantBooking, responseTime }: { videoCallAvailable?: boolean, instantBooking?: boolean, responseTime: string}) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {videoCallAvailable && (
      <Feature icon={Video} text="Video" color="text-blue-700" bg="bg-blue-50" />
    )}
    {instantBooking && (
      <Feature icon={Zap} text="Instant" color="text-green-700" bg="bg-green-50" />
    )}
    <Feature icon={Clock} text={responseTime} color="text-purple-700" bg="bg-purple-50" />
  </div>
);


export const Feature = ({ icon: Icon, text, color, bg }: FeatureProps) => (
  <div className={`flex items-center gap-1 text-xs ${bg} ${color} px-2 py-1 rounded-lg`}>
    <Icon size={12} /> {text}
  </div>
);

export const MentorTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {tags.slice(0, 3).map((tag, idx) => (
      <span
        key={idx}
        className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100"
      >
        {tag}
      </span>
    ))}
    {tags.length > 3 && (
      <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
        +{tags.length - 3}
      </span>
    )}
  </div>
);

export const MentorPricing = ({ sessionRate }: { sessionRate: string }) => (
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 mb-4">
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">Session Rate</span>
      <span className="font-bold text-gray-900">{sessionRate}</span>
    </div>
  </div>
);

export const MentorActions = ({onStartChart, onReadMore}: {
    onStartChart: () => void,
    onReadMore?: () => void
  }) => (
  <div className="flex gap-2">
    <button
      className="flex-1 bg-gradient-to-r from-purple-400 to-lavender-600 text-white py-3.5 rounded-xl font-bold hover:from-purple-500 hover:to-lavender-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      onClick={onStartChart}
    >
      <MessageCircle size={18} /> Start Chat
    </button>
    {onReadMore && (
      <button
        className="px-5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all hover:scale-105"
        onClick={onReadMore}
      >
        <ChevronRight size={20}/>
      </button>
    )}
  </div>
);


export const MentorLanguages = ({ languages }: { languages: string[] }) => {
  if (!languages || languages.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Globe size={16} className="text-indigo-600" />
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Languages</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang, idx) => (
          <span
            key={idx}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800"
          >
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
};

// Availability Component
export const MentorAvailability = ({ availability }: { availability: string }) => {
  if (!availability) return null;

  return (
    <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3 border border-green-100 dark:border-green-800">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-green-600 dark:text-green-400" />
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Available</p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{availability}</p>
        </div>
      </div>
    </div>
  );
};

// Specializations Component
export const MentorSpecializations = ({ specializations }: { specializations: string[] }) => {
  if (!specializations || specializations.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} className="text-purple-600" />
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Specializations</h4>
      </div>
      <div className="space-y-2">
        {specializations.map((spec, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            <span>{spec}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Achievements Component
export const MentorAchievements = ({ achievements }: { achievements: string[] }) => {
  if (!achievements || achievements.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Award size={16} className="text-yellow-600" />
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Achievements</h4>
      </div>
      <div className="space-y-2">
        {achievements.map((achievement, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg px-3 py-2 border border-yellow-100 dark:border-yellow-800"
          >
            <Award size={14} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{achievement}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MentorPricingEnhanced = ({pricing}: {
  pricing: { session: string; package: string }
}) => {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Pricing Options</h4>
      <div className="space-y-2">
        {/* Session Rate */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Single Session</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{pricing.session}</p>
            </div>
            <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300">
              Per Hour
            </div>
          </div>
        </div>

        {/* Package Rate */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-3 border-2 border-indigo-200 dark:border-indigo-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            BEST VALUE
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Monthly Package</p>
              <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{pricing.package}</p>
            </div>
            <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              Per Month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

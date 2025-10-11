'use client';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState, useMemo } from 'react';
import {Award, Sparkles, TrendingUp,BookOpen, Heart, Search, X, ChevronDown, Zap } from 'lucide-react';
import {Input} from "@/components/ui/input";
import MentorCard, {MentorProps} from "@/components/talk-space/mentors-card";
import TalkSpaceWrapper from "@/components/talk-space/talk-space-wrapper";
import {useTalkSpaceStore} from "@/hooks/talkSpace/useTalkSpaceStore";
import {useRouter} from "next/navigation";

export const mentors: MentorProps[] = [
  {
    id: "1",
    name: 'Dr. Sarah Johnson',
    username: 'SarahMentorPro',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=200&fit=crop',
    country: '🇺🇸',
    rating: 5.0,
    reviewCount: 127,
    specialty: 'Career Development',
    category: 'career',
    tags: ['Leadership', 'Work-Life Balance', 'Professional Growth', 'Interview Prep'],
    isVerified: true,
    isPro: true,
    isOnline: true,
    responseTime: '< 1 hour',
    bio: 'Former Fortune 500 executive turned career coach. 15+ years helping professionals navigate career transitions, negotiate salaries, and achieve leadership positions.',
    mentees: 245,
    sessions: 820,
    experience: '15+ years',
    languages: ['English', 'Spanish'],
    availability: 'Mon-Fri, 9AM-5PM EST',
    specializations: ['Executive Coaching', 'Salary Negotiation', 'Leadership Development'],
    achievements: ['Top 1% Mentor 2024', '500+ Success Stories'],
    pricing: { session: '$150/hr', package: '$500/month' },
    videoCallAvailable: true,
    instantBooking: true
  },
  {
    id: "2",
    name: 'Michael Chen',
    username: 'MikeTechMentor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=200&fit=crop',
    country: '🇨🇦',
    rating: 4.9,
    reviewCount: 203,
    specialty: 'Tech Industry Transition',
    category: 'tech',
    tags: ['Software Engineering', 'Career Switch', 'System Design', 'Coding Interview'],
    isVerified: true,
    isPro: true,
    isOnline: true,
    responseTime: '< 2 hours',
    bio: 'Senior Staff Engineer at Google. Helping aspiring developers break into FAANG companies. Specialized in system design, algorithm interviews, and career growth in tech.',
    mentees: 312,
    sessions: 1050,
    experience: '12+ years',
    languages: ['English', 'Mandarin', 'Cantonese'],
    availability: 'Evenings & Weekends PST',
    specializations: ['FAANG Interview Prep', 'System Design', 'Career Growth'],
    achievements: ['Mentor of the Year 2023', '1000+ Interview Successes'],
    pricing: { session: '$200/hr', package: '$700/month' },
    videoCallAvailable: true,
    instantBooking: true
  },
  {
    id: "3",
    name: 'Priya Sharma',
    username: 'PriyaLifeCoach',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=200&fit=crop',
    country: '🇮🇳',
    rating: 5.0,
    reviewCount: 189,
    specialty: 'Personal Development & Mindfulness',
    category: 'personal',
    tags: ['Confidence Building', 'Goal Setting', 'Mindfulness', 'Self-Care'],
    isVerified: true,
    isPro: false,
    isOnline: false,
    responseTime: '< 4 hours',
    bio: 'Certified life coach and mindfulness instructor. Empowering individuals to discover their authentic selves and build unshakeable confidence through holistic approaches.',
    mentees: 458,
    sessions: 1520,
    experience: '8+ years',
    languages: ['English', 'Hindi', 'Bengali'],
    availability: 'Flexible scheduling',
    specializations: ['Mindfulness Training', 'Confidence Coaching', 'Goal Achievement'],
    achievements: ['Best Personal Coach 2024', '1500+ Lives Transformed'],
    pricing: { session: '$100/hr', package: '$350/month' },
    videoCallAvailable: true,
    instantBooking: false
  },
  {
    id: "4",
    name: 'James Williams',
    username: 'JamesStartupGuru',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=200&fit=crop',
    country: '🇬🇧',
    rating: 4.8,
    reviewCount: 95,
    specialty: 'Startup & Entrepreneurship',
    category: 'business',
    tags: ['Startups', 'Business Strategy', 'Fundraising', 'Product-Market Fit'],
    isVerified: true,
    isPro: true,
    isOnline: true,
    responseTime: '< 3 hours',
    bio: '3x successful founder with 2 exits. Angel investor and startup advisor. Helping entrepreneurs build, scale, and fund their ventures from idea to Series A.',
    mentees: 178,
    sessions: 567,
    experience: '10+ years',
    languages: ['English', 'French'],
    availability: 'Flexible',
    specializations: ['Startup Strategy', 'Fundraising', 'Go-to-Market'],
    achievements: ['$50M+ Raised by Mentees', '25 Successful Exits'],
    pricing: { session: '$250/hr', package: '$900/month' },
    videoCallAvailable: true,
    instantBooking: true
  },
  {
    id: "5",
    name: 'Dr. Emma Thompson',
    username: 'EmmaAcademicSuccess',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=200&fit=crop',
    country: '🇦🇺',
    rating: 4.9,
    reviewCount: 156,
    specialty: 'Academic Excellence & Study Skills',
    category: 'academic',
    tags: ['Study Skills', 'Time Management', 'Exam Prep', 'Research Methods'],
    isVerified: true,
    isPro: false,
    isOnline: false,
    responseTime: '< 6 hours',
    bio: 'PhD in Educational Psychology. Former university professor helping students master effective study techniques, manage academic stress, and achieve top grades.',
    mentees: 341,
    sessions: 903,
    experience: '11+ years',
    languages: ['English'],
    availability: 'Weekday afternoons AEST',
    specializations: ['Study Techniques', 'Exam Strategy', 'Research Writing'],
    achievements: ['98% Student Success Rate', 'Published Author'],
    pricing: { session: '$80/hr', package: '$280/month' },
    videoCallAvailable: true,
    instantBooking: false
  },
];

const MentorsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const setCallStatus = useTalkSpaceStore((s) => s.setCallStatus);
  const setMentor = useTalkSpaceStore((s) => s.setMentor);

  const router = useRouter();

  const categories = [
    { id: 'all', name: 'All Mentors', icon: Sparkles },
    { id: 'career', name: 'Career', icon: TrendingUp },
    { id: 'personal', name: 'Personal Growth', icon: Heart },
    { id: 'academic', name: 'Academic', icon: BookOpen },
    { id: 'business', name: 'Business', icon: Award },
    { id: 'tech', name: 'Technology', icon: Zap },
  ];

  const filteredMentors = useMemo(() => {
    let result = mentors;

    if (selectedCategory !== 'all') {
      result = result.filter(m => m.category === selectedCategory);
    }

    if (searchQuery) {
      result = result.filter(mentor =>
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return result;
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleStartChart = (mentorId: string) => {
    const selectedMentor = mentors.find((m) => m.id === mentorId);
    if (!selectedMentor) return;

    setMentor({mentor: selectedMentor});

    setCallStatus("requesting")
    router.push(`/talk-space?mentorId=${mentorId}`);
  }

  const handleReadMore = (mentorId: string) => {
    console.log(mentorId)
  }

  return (
    <TalkSpaceWrapper>
      <div className="sticky top-0">
        <div className="max-w-7xl mx-auto">
          <div className={"flex flex-col items-start md:items-center justify-center"}>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Discover Your Perfect Mentor
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Connect with verified experts who can transform your journey
            </p>
          </div>
          <div className={"flex items-center justify-between mt-2 md:mt-4"}>
            <div className="relative group w-full max-w-md lg:max-w-lg hidden md:flex">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 transition" size={20}/>
              <Input
                type="text"
                placeholder="Search by name, expertise, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border py-6 pl-12 border-neutral-200 rounded-full focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all text-lg"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X size={20}/>
                </button>
              )}
            </div>

           <div className={"ml-auto"}>
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <button
                   className=" flex items-center justify-between gap-2 rounded-md border border-neutral-200 px-4 py-2 text-sm transition-all">
                   {categories.find(cat => cat.id === selectedCategory)?.name || "Select Category"}
                   <ChevronDown className="ml-1 h-4 w-4"/>
                 </button>
               </DropdownMenuTrigger>

               <DropdownMenuContent align="end" className="flex flex-col min-w-[200px]">
                 {categories.map(cat => {
                   const Icon = cat.icon;
                   return (
                     <DropdownMenuItem
                       key={cat.id}
                       onClick={() => setSelectedCategory(cat.id)}
                       className={`flex items-center gap-2 px-3 py-2 text-sm ${
                         selectedCategory === cat.id ? "bg-indigo-100 text-indigo-700" : ""}`}>
                       <Icon size={16}/>{cat.name}
                     </DropdownMenuItem>
                   );
                 })}
               </DropdownMenuContent>
             </DropdownMenu>
           </div>
          </div>

          <span className="w-full flex items-end justify-end text-sm text-gray-600 dark:text-gray-300 font-medium">
              {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} found
            </span>
        </div>
      </div>

      <div className="w-full mx-auto pt-4">
        <div className={`grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3`}>
          {filteredMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              isFavorite={favoriteIds.has(mentor.id)}
              onToggleFavorite={toggleFavorite}
              onStartChart={() => handleStartChart(mentor.id)}
              onReadMore={() => handleReadMore(mentor.id)}
            />
          ))}
        </div>
      </div>
    </TalkSpaceWrapper>
  )
}
export default MentorsPage;
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {Heart, Sprout, Palette, MessageCircle, LucideIcon} from 'lucide-react';
import {CampfirePurpose, getBgSeverity} from "@/components/campfires/campfires.types";

interface PurposeCardData {
  purpose: CampfirePurpose;
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
}

// Single reusable card component
interface PurposeCardProps {
  data: PurposeCardData;
}

// Purpose data array
const purposesData: PurposeCardData[] = [
  {
    purpose: CampfirePurpose.Support,
    title: "Support Circle",
    description: "A safe space for sharing struggles, seeking comfort, and offering encouragement. Here, vulnerability is welcomed and every voice matters as we support each other through life's challenges.",
    features: ["Emotional support", "Peer encouragement", "Safe sharing", "Community care"],
    icon: Heart
  },
  {
    purpose: CampfirePurpose.Growth,
    title: "Growth Group",
    description: "Focused on personal development and learning together. Share goals, celebrate progress, and motivate each other on journeys of self-improvement and skill development.",
    features: ["Goal setting", "Progress tracking", "Skill sharing", "Motivation"],
    icon: Sprout
  },
  {
    purpose: CampfirePurpose.Creative,
    title: "Creative Outlet",
    description: "A vibrant space for artists, writers, and creative minds to share work, collaborate on projects, and inspire each other's artistic journeys.",
    features: ["Creative sharing", "Collaboration", "Feedback & critique", "Artistic inspiration"],
    icon: Palette
  },
  {
    purpose: CampfirePurpose.General,
    title: "General Discussion",
    description: "Open conversations about life, interests, and everything in between. The perfect place for casual chats, sharing thoughts, and connecting over shared experiences.",
    features: ["Open dialogue", "Casual conversations", "Topic variety", "Community bonding"],
    icon: MessageCircle
  }
];

const CampfirePurposes = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-4">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Campfire Purposes
        </h2>
        <p className="text-gray-600 text-sm dark:text-gray-400 max-w-2xl mx-auto">
          Each campfire serves a unique purpose, creating focused campfire where meaningful conversations can flourish.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        {purposesData.map((purposeData) => (
          <PurposeCard
            key={purposeData.purpose}
            data={purposeData}
          />
        ))}
      </div>

      <div className="text-center mt-8 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🔥 Remember: Every campfire is a judgment-free zone where authentic sharing and genuine connection are at the heart of every conversation.
        </p>
      </div>
    </div>
  );
};

export default CampfirePurposes;


//Purpose card component
const PurposeCard: React.FC<PurposeCardProps> = ({ data }) => {
  const IconComponent = data.icon;

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-0 shadow-lg dark:bg-gray-800/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getBgSeverity(data.purpose)}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {data.title}
              </CardTitle>
              <Badge
                variant="secondary"
                className={`mt-1 ${getBgSeverity(data.purpose)} border font-normal`}
              >
                {data.purpose.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {data.description}
        </CardDescription>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            What to expect:
          </h4>
          <div className="flex flex-wrap gap-1">
            {data.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
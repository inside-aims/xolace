'use client';

import TimelineItem from './timeline-item';
//import { UpcomingFeatureCard } from "./upcoming-feature-card"
import { Activity, MessageCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UpdateLog {
  version: string;
  date: string;
  title: string;
  changes: string[];
  type?: 'major' | 'minor' | 'patch';
  status?: 'released' | 'upcoming';
}

interface TimelineViewProps {
  updates: UpdateLog[];
  showUpcomingFeatures?: boolean;
}

const upcomingFeatures = [
  {
    title: 'AI Wellness Coach',
    description: 'Personalized AI-powered wellness recommendations',
    eta: 'Q2 2025',
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    title: 'Voice Journaling',
    description: 'Record and transcribe your thoughts with voice notes',
    eta: 'Q3 2025',
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    title: 'Wellness Analytics',
    description: 'Advanced insights into your wellness patterns',
    eta: 'Q3 2025',
    icon: <Activity className="h-4 w-4" />,
  },
];

export function TimelineView({
  updates,
  showUpcomingFeatures = false,
}: TimelineViewProps) {
  return (
    <div className="mt-8 space-y-8">
      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-0 bottom-0 left-4 w-0.5 transform bg-gradient-to-b from-orange-500 via-red-500 to-pink-500 md:left-1/2 md:-translate-x-px"></div>

        <div className="space-y-12">
          {updates.map((update, index) => (
            <TimelineItem key={update.version} update={update} index={index} />
          ))}
        </div>
      </div>

      {/* Upcoming Features */}
      {showUpcomingFeatures && (
        <div className="mt-16">
          <div className="mb-8 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold">
              On the Horizon
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Exciting features we're working on to enhance your Digital
              Campfire experience
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group border-0 bg-gradient-to-br from-orange-50 to-pink-50 transition-all duration-300 hover:shadow-lg dark:from-orange-900/20 dark:to-pink-900/20"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 p-2 text-white transition-transform group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.eta}
                    </Badge>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

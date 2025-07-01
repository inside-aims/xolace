import React from 'react';
import { UpdateLog } from '@/constants/changeLogs';
import { getVersionColor } from '@/utils/helpers/updateHelpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Sparkles,
  Rocket,
  Zap,
  RefreshCw,
  Clock,
} from 'lucide-react';

interface TimelineItemProps {
  update: UpdateLog;
  index: number;
}

const getVersionIcon = (type: string) => {
  switch (type) {
    case 'major':
      return <Rocket className="h-5 w-5" />;
    case 'minor':
      return <Sparkles className="h-5 w-5" />;
    case 'patch':
      return <Zap className="h-5 w-5" />;
    default:
      return <RefreshCw className="h-5 w-5" />;
  }
};

const parseChanges = (changes: string[]) => {
  return changes.map((change, index) => {
    if (change.startsWith('**') && change.endsWith('**')) {
      return (
        <h4
          key={index}
          className="text-foreground mt-4 mb-2 text-lg font-semibold"
        >
          {change.replace(/\*\*/g, '')}
        </h4>
      );
    }
    return (
      <p
        key={index}
        className="text-muted-foreground mb-1 leading-relaxed dark:text-gray-300"
      >
        {change}
      </p>
    );
  });
};

const TimelineItem = ({ update, index }: TimelineItemProps) => {
  return (
    <div
      key={update.version}
      className={`relative flex items-start ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:items-center`}
    >
      {/* Timeline dot */}
      <div
        className={`absolute left-0 h-8 w-8 md:left-1/2 ${getVersionColor(update.type || 'patch')} z-10 flex transform items-center justify-center rounded-full text-white shadow-lg md:-translate-x-4`}
      >
        {getVersionIcon(update.type || 'patch')}
      </div>

      {/* Content card */}
      <div
        className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}
      >
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-900/80">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    update.status === 'upcoming' ? 'secondary' : 'default'
                  }
                  className="text-xs"
                >
                  v{update.version}
                </Badge>
                {update.status === 'upcoming' && (
                  <Badge
                    variant="outline"
                    className="border-orange-500 text-xs text-orange-600"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    Coming Soon
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground flex items-center text-sm">
                <Calendar className="mr-1 h-4 w-4" />
                {update.date}
              </div>
            </div>
            <CardTitle className="text-foreground text-xl font-bold">
              {update.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">{parseChanges(update.changes)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimelineItem;

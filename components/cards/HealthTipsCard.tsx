import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CircleArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HealthTipCardProps {
  tip: {
    id: number;
    title: string;
    slug: string;
    author_name: string;
    author_avatar_url: string;
    content: string;
    created_at: string;
    read_time: number;
    category: string;
    excerpt: string;
  };
  setSelectedTip: (tip: HealthTipCardProps['tip']) => void;
}

const HealthTipsCard = ({ tip, setSelectedTip }: HealthTipCardProps) => {
  return (
    <Link href={`/health-tips/${tip.slug}`}>
    <Card
      key={tip.id}
      className="group cursor-pointer p-4 transition-all duration-200 hover:shadow-lg md:p-6 dark:border-gray-500/20"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Avatar>
            <AvatarImage
              src={tip.author_avatar_url || undefined}
              alt={tip.author_name}
            />
            <AvatarFallback>{tip.author_name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-foreground text-lg font-bold transition-colors group-hover:text-emerald-600">
                {tip.title}
              </h3>
              <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 capitalize dark:bg-emerald-900/30 dark:text-emerald-300">
                {tip.category}
              </span>
            </div>
            <span className="text-muted-foreground flex-shrink-0 text-xs whitespace-nowrap">
              {/* to string */}
              {tip.read_time.toString()} mins read
            </span>
          </div>

          {tip.excerpt ? (
            <p className="text-foreground/80 line-clamp-2 text-sm">
              {tip.excerpt}
            </p>
          ) : (
            <p className="text-foreground/80 line-clamp-2 text-sm">
              This is a well curated health tip
            </p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="text-muted-foreground text-xs">
              By <span className="font-semibold">{tip.author_name}</span>
            </div>

            <div
              className={
                'text-lavender-400 group-hover:text-lavender-600 flex items-center text-sm'
              }
            >
              Read more
              <span
                className={
                  'text-lavender-400 group-hover:lavender-500 ml-1 transition-transform group-hover:translate-x-1'
                }
              >
                <CircleArrowRight size={16} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
    </Link>
  );
};

export default HealthTipsCard;

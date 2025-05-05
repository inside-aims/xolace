import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';

interface GradientTextLinkProps {
  text?: string;
  icon?: string;
  fromColor?: string;
  viaColor?: string;
  toColor?: string;
  link: string;
}

const GradientTextLink = ({
  text,
  fromColor = '#ffaa40',
  viaColor = '#9c40ff',
  toColor = '#ffaa40',
  link,
}: GradientTextLinkProps) => {
  return (
    <div className="z-10 flex items-center justify-end">
      <Link href={link}>
        <AnimatedGradientText>
          🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{' '}
          <span
            className={cn(
              `inline animate-gradient bg-linear-to-r from-[${fromColor}] via-[${viaColor}] to-[${toColor}] bg-[length:var(--bg-size)_100%] bg-clip-text dark:text-white text-black`,
            )}
          >
            {text}
          </span>
          <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedGradientText>
      </Link>
    </div>
  );
};

export default GradientTextLink;

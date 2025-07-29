'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

import { formUrlQuery, removeKeyFromQuery } from '@/lib/url';

import { Input } from '@/components/ui/input';

interface LocalSearchPropsInterface {
  route: string;
  imgSrc?: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearch = ({
  route,
  placeholder,
  otherClasses,
}: LocalSearchPropsInterface) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [searchQuery, setSearchQuery] = useState<string>(query);

  useEffect(() => {
    // debounce search querying for a few seconds
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'query',
          value: searchQuery,
        });

        router.push(newUrl, {
          scroll: false,
        });
      } else {
        if (pathname === route) {
          // if searchQuery is totally empty
          const newUrl = removeKeyFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['query'],
          });
          router.push(newUrl, {
            scroll: false,
          });
        }
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, route, searchParams, pathname]);

  return (
    <div className={`relative mx-auto w-full max-w-2xl ${otherClasses}`}>
      <div className="group relative">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl  dark:bg-gradient-to-r dark:from-[#0536ff]/20 dark:to-[#6a71ea]/20 opacity-0 blur-2xl dark:blur-xl transition-opacity duration-300 group-hover:opacity-100 " />

        {/* Search input */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-700 dark:bg-gray-900/50 backdrop-blur-sm transition-colors duration-300 group-hover:border-[#6a71ea]/50">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full py-4 pl-12 pr-16 bg-transparent border-0 dark:text-gray-200 text-gray-700 placeholder:text-gray-700 dark:placeholder:text-gray-500  focus:ring-0 focus:outline-none text-base"
          />
          {/* Search icon */}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#6a71ea] transition-colors duration-300" />

          {/* Decorative sparkles */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-[#6a71ea] animate-pulse opacity-60" />
            <div className="w-1 h-1 bg-[#0536ff] rounded-full animate-ping opacity-40" />
          </div>
        </div>
      </div>

      {/* Search suggestions hint */}
      {searchQuery && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">Press Enter to search or wait for auto-search</span>
        </div>
      )}
    </div>
  );
};

export default LocalSearch;

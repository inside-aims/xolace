'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

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
        console.log('empty ', searchQuery);
        if (pathname === route) {
          console.log("route ")
          // if searchQuery is totally empty
          const newUrl = removeKeyFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['query'],
          });
          console.log("removing query", newUrl);
          router.push(newUrl, {
            scroll: false,
          });
        }
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, route, searchParams, pathname]);

  return (
    <div className={`relative mx-auto w-full max-w-md ${otherClasses}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="no-focus w-full py-2 pl-10 pr-4 outline-none"
      />
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
        size={20}
      />
    </div>
  );
};

export default LocalSearch;

import React from 'react';
import type { Metadata } from 'next';

import { ExploreHeader } from '@/components/hocs/exploreComponents/explore-header';
import ExploreContent from '@/components/hocs/exploreComponents/explore-content';

export const metadata: Metadata = {
  title: 'Explore',
  description: "Browse authentic stories and experiences shared by real individuals within our vibrant mental health and self-growth community."
}

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}


const ExplorePage = async ({ searchParams }: SearchParams) => {
  const { query = '', filter = '' } = await searchParams;

  

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        <ExploreHeader />
        <ExploreContent query={query} filter={filter} />
      </div>
    </div>
  );
};

export default ExplorePage;

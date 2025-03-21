import type { Metadata } from 'next';

import { PostForm } from '@/components/forms/PostForm';
import TourButton from '@/components/shared/Tour/TourButton';
import TourProvider from '@/components/shared/Tour/TourProvider';
import { createPostSteps } from '@/constants/tourSteps';
import React from 'react';


export const metadata: Metadata = {
  title: 'Create Post',
}

const CreatePost = () => {
  return (
    <TourProvider steps={createPostSteps}>
      <PostForm />

      <div className="fixed bottom-10 right-6 z-50 block rounded-full md:hidden">
        <TourButton />
      </div>
    </TourProvider>
  );
};

export default CreatePost;
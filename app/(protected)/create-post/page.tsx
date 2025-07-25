import type { Metadata } from 'next';

import { PostForm } from '@/components/forms/PostForm';
import TourButton from '@/components/shared/Tour/TourButton';
import TourProvider from '@/components/shared/Tour/TourProvider';
import { createPostSteps } from '@/constants/tourSteps';
import React from 'react';

export const metadata: Metadata = {
  title: 'Create Post',
  description: "Create and share your story with a caring community offering support, advice, and encouragement for mental wellness and personal growth."
};

const CreatePost = () => {
  return (
    <TourProvider steps={createPostSteps}>
      <div className="container-spacing w-full">
        <PostForm />

        <div className="fixed bottom-10 right-6 z-50 block rounded-full">
          <TourButton />
        </div>
      </div>
    </TourProvider>
  );
};

export default CreatePost;

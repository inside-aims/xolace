import { PostForm } from '@/components/forms/PostForm';
import TourButton from '@/components/shared/Tour/TourButton';
import TourProvider from '@/components/shared/Tour/TourProvider';
import { createPostSteps } from '@/constants/tourSteps';
import React from 'react';

const CreatePost = () => {
  return (
    <TourProvider steps={createPostSteps} >
      <PostForm />
      <TourButton />
    </TourProvider>
  );
};

export default CreatePost;

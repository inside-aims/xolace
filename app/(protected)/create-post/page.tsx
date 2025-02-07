import { PostForm } from '@/components/forms/PostForm';
import TourWrapper from '@/components/shared/Tour/TourWrapper';
import { createPostSteps } from '@/constants/tourSteps';
import React from 'react';

const CreatePost = () => {
  const steps = createPostSteps()
  return (
    <TourWrapper steps={steps} >
      <PostForm />
    </TourWrapper>
  );
};

export default CreatePost;

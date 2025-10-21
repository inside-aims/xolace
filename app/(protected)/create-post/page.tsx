import type { Metadata } from 'next';

import { PostForm } from '@/components/post-form/PostFormV2';
import TourButton from '@/components/shared/Tour/TourButton';
import TourProvider from '@/components/shared/Tour/TourProvider';
import { createPostSteps } from '@/constants/tourSteps';
import React from 'react';

export const metadata: Metadata = {
  title: 'Create Post',
  description: "Create and share your story with a caring community offering support, advice, and encouragement for mental wellness and personal growth."
};

type SearchParams = Promise<{ [key: string]: string | undefined }>

const CreatePost = async (props: {
  searchParams: SearchParams
}) => {

  const searchParams = await props.searchParams;
  const submit = searchParams.submit;
  const prompt = searchParams.prompt;
  const prompt_id = searchParams.prompt_id;

  return (
    <TourProvider steps={createPostSteps}>
      <div className="container-spacing w-full">
        <PostForm submitToSlug={submit} promptTextQuery={prompt} promptIdQuery={prompt_id} />

        <div className="fixed bottom-10 right-6 z-50 block rounded-full">
          <TourButton />
        </div>
      </div>
    </TourProvider>
  );
};

export default CreatePost;
